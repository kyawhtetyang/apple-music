import boto3
from boto3.s3.transfer import TransferConfig

from app.settings import MUSIC_DIR, R2_BUCKET, R2_ENDPOINT

# -----------------------------
# Boto3 client
# -----------------------------
client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    region_name="auto"
)

# -----------------------------
# Transfer config to disable multipart upload for smaller files
# -----------------------------
config = TransferConfig(
    multipart_threshold=1024 * 1024 * 1024  # 1GB threshold, disables multipart for smaller files
)

# -----------------------------
# Upload files recursively
# -----------------------------
for local_path in MUSIC_DIR.rglob("*"):
    if not local_path.is_file():
        continue

    relative_path = local_path.relative_to(MUSIC_DIR).as_posix()
    print(f"Uploading {relative_path}...")
    client.upload_file(
        str(local_path),
        R2_BUCKET,
        relative_path,
        Config=config
    )

print("✅ Upload complete")
