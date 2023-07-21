-- CreateTable
CREATE TABLE "brand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gender" (
    "id" SERIAL NOT NULL,
    "identity" VARCHAR(10) NOT NULL,

    CONSTRAINT "gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_product" (
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "product_q" INTEGER,

    CONSTRAINT "order_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" INTEGER NOT NULL,
    "brand" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" INTEGER NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(10) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(10) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "gender" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_fkey" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brand_fkey" FOREIGN KEY ("brand") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_fkey" FOREIGN KEY ("category") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_status_fkey" FOREIGN KEY ("status") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_gender_fkey" FOREIGN KEY ("gender") REFERENCES "gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_fkey" FOREIGN KEY ("role") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
