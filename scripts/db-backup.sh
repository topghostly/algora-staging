#!/bin/bash
# -----------------------------------------------------------------------------
# Database Backup Script
# Description: Dumps a PostgreSQL database, compresses it, and securely 
#              uploads the resulting archive to an AWS S3 bucket.
# -----------------------------------------------------------------------------

# Exit immediately if a command exits with a non-zero status
set -e
# Treat unset variables as an error when substituting
set -u
# Fail a pipeline if any command in the pipeline fails
set -o pipefail

# 1. Validation of Required Environment Variables
# We validate these immediately so the script errors out cleanly if misconfigured.
if [ -z "${DATABASE_URL:-}" ]; then
  echo "[ERROR] DATABASE_URL environment variable is not set." >&2
  exit 1
fi

if [ -z "${S3_BUCKET:-}" ]; then
  echo "[ERROR] S3_BUCKET environment variable is not set." >&2
  exit 1
fi

# 2. Configuration Parameters
TIMESTAMP=$(date -u +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILENAME="db_backup_${TIMESTAMP}.sql.gz"
S3_DESTINATION="s3://${S3_BUCKET}/backups/${BACKUP_FILENAME}"

echo "[INFO] Starting database backup creation process at $(date -u)"

# 3. Create and Compress the Database Dump
# We pipe the output of pg_dump directly into gzip to stream the compression,
# preventing the raw SQL from sitting uncompressed on the disk.
echo "[INFO] Running pg_dump and compressing output..."
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILENAME"
echo "[INFO] Local backup archive generated successfully: $BACKUP_FILENAME"

# Determine size of the generated archive to append to logs for observability
BACKUP_SIZE=$(ls -lh "$BACKUP_FILENAME" | awk '{print $5}')
echo "[INFO] Compressed Archive Size: $BACKUP_SIZE"

# 4. Upload to AWS S3
echo "[INFO] Uploading archive to AWS S3 bucket destination: ${S3_DESTINATION}..."
aws s3 cp "$BACKUP_FILENAME" "$S3_DESTINATION" --only-show-errors
echo "[INFO] Upload to S3 completed successfully."

# 5. Secure Cleanup
# Crucial step to ensure no sensitive data is left lingering on the runner/VM disk.
echo "[INFO] Removing local archive to ensure no lingering sensitive data..."
rm -f "$BACKUP_FILENAME"

echo "[INFO] Backup process completed successfully at $(date -u)!"
