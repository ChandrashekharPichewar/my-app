-- CreateTable
CREATE TABLE "issue_reports" (
    "id" TEXT NOT NULL,
    "ticket_code" VARCHAR(20) NOT NULL,
    "user_id" TEXT NOT NULL,
    "issue_type" VARCHAR(100) NOT NULL,
    "urgency" VARCHAR(100) NOT NULL,
    "brief_description" VARCHAR(255) NOT NULL,
    "details" TEXT NOT NULL,
    "device_id" VARCHAR(50),
    "status" VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "issue_reports_ticket_code_key" ON "issue_reports"("ticket_code");

-- CreateIndex
CREATE INDEX "issue_reports_user_id_idx" ON "issue_reports"("user_id");

-- AddForeignKey
ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
