import os, random, tempfile, uuid

import modal
from pydantic import BaseModel

app = modal.App("ai-image-generator-backend")

# Turbo-only
MODEL_ID = "Tongyi-MAI/Z-Image-Turbo"
S3_SECRET = modal.Secret.from_name(os.getenv("MODAL_S3_SECRET_NAME", "ai-image-generator-aws-secret"))
SECRETS = [S3_SECRET]
VOL = modal.Volume.from_name(os.getenv("MODAL_HF_CACHE_VOLUME_NAME", "hf-hub-cache"), create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git")
    .pip_install_from_requirements("requirements.txt")
    .env({"HF_XET_HIGH_PERFORMANCE": "1", "HF_HUB_CACHE": "/models"})
)


class Req(BaseModel):
    prompt: str
    negative_prompt: str | None = None
    width: int = 1024
    height: int = 1024
    num_inference_steps: int | None = None
    guidance_scale: float | None = None
    seed: int | None = None


@app.cls(
    image=image,
    gpu=os.getenv("MODAL_GPU", "L40S"),
    timeout=600,
    scaledown_window=600,
    volumes={"/models": VOL},
    secrets=SECRETS,
)
class ZImageServer:
    @modal.enter()
    def load(self):
        import torch
        from diffusers import ZImagePipeline

        self.t, self.P = torch, ZImagePipeline
        self.token = (os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN") or "").strip().strip("\"'") or None
        self.pipe = None

        self.pipe = self.P.from_pretrained(
            MODEL_ID,
            torch_dtype=self.t.bfloat16,
            low_cpu_mem_usage=False,
            token=self.token,
        ).to("cuda")

    @modal.fastapi_endpoint(method="POST", docs=True)
    def generate_image(self, r: Req):
        import boto3

        bucket = os.getenv("AWS_S3_BUCKET_NAME")

        pipe = self.pipe

        seed = int(r.seed) if r.seed is not None else random.randint(0, 2**32 - 1)
        gen = self.t.Generator("cuda").manual_seed(seed)

        steps = int(r.num_inference_steps) if r.num_inference_steps is not None else 9
        scale = float(r.guidance_scale) if r.guidance_scale is not None else 0.0

        img = pipe(
            **{
                "prompt": r.prompt,
                "height": int(r.height),
                "width": int(r.width),
                "num_inference_steps": steps,
                "guidance_scale": scale,
                "generator": gen,
                "negative_prompt": r.negative_prompt,
            }
        ).images[0]

        key = f"images/{uuid.uuid4()}.png"
        with tempfile.TemporaryDirectory(prefix="zimg_") as d:
            path = os.path.join(d, "out.png")
            img.save(path)
            s3 = boto3.client("s3")
            s3.upload_file(path, bucket, key, ExtraArgs={"ContentType": "image/png"})

            url = f"https://{bucket}.s3.amazonaws.com/{key}"

        return {"image_s3_key": key, "image_url": url, "seed": seed, "model_id": MODEL_ID}