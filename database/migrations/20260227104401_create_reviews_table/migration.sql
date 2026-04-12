-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" VARCHAR(255) NOT NULL,
    "user_name" VARCHAR(255),
    "user_image" TEXT,
    "content" TEXT NOT NULL,
    "score" INTEGER,
    "thumbs_up_count" INTEGER,
    "review_created_version" VARCHAR(100),
    "review_datetime" TIMESTAMP,
    "reply_content" TEXT,
    "replied_at" TIMESTAMP,
    "app_version" VARCHAR(100),
    "timestamp_unix" BIGINT,
    "timestamp_formatted" VARCHAR(50),
    "source" VARCHAR(50) NOT NULL,
    "is_analyzed" BOOLEAN DEFAULT false,
    "sentiment_result" VARCHAR(20),
    "confidence_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE INDEX "idx_unprocessed_reviews" ON "reviews"("is_analyzed");

-- CreateIndex
CREATE INDEX "idx_source_sentiment" ON "reviews"("source", "sentiment_result");
