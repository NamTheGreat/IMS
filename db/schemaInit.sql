-- ** Database generated with pgModeler (PostgreSQL Database Modeler).
-- ** pgModeler version: 1.2.2
-- ** PostgreSQL version: 18.0
-- ** Project Site: pgmodeler.io
-- ** Model Author: ---
-- object: ims_admin | type: ROLE --
-- DROP ROLE IF EXISTS ims_admin;
CREATE ROLE ims_admin WITH 
	INHERIT
	LOGIN;
-- ddl-end --


-- ** Database creation must be performed outside a multi lined SQL file. 
-- ** These commands were put in this file only as a convenience.

-- object: new_database | type: DATABASE --
-- DROP DATABASE IF EXISTS new_database;
CREATE DATABASE new_database;
-- ddl-end --


-- object: ims | type: SCHEMA --
-- DROP SCHEMA IF EXISTS ims CASCADE;
CREATE SCHEMA ims;
-- ddl-end --
ALTER SCHEMA ims OWNER TO ims_admin;
-- ddl-end --

SET search_path TO pg_catalog,public,ims;
-- ddl-end --

-- object: ims.product | type: TABLE --
-- DROP TABLE IF EXISTS ims.product CASCADE;
CREATE TABLE ims.product (
	product_id uuid NOT NULL,
	name varchar(255) NOT NULL,
	description text,
	category varchar(255),
	unit_price decimal(2) NOT NULL,
	CONSTRAINT product_pk PRIMARY KEY (product_id)
);
-- ddl-end --
COMMENT ON COLUMN ims.product.product_id IS E'Unique product identifier';
-- ddl-end --
COMMENT ON COLUMN ims.product.name IS E'Name of the product';
-- ddl-end --
COMMENT ON COLUMN ims.product.description IS E'OPTIONAL description of the product';
-- ddl-end --
COMMENT ON COLUMN ims.product.category IS E'Category or type of product';
-- ddl-end --
COMMENT ON COLUMN ims.product.unit_price IS E'Cost or standard price per unit';
-- ddl-end --
ALTER TABLE ims.product OWNER TO ims_admin;
-- ddl-end --

-- object: ims.supplier | type: TABLE --
-- DROP TABLE IF EXISTS ims.supplier CASCADE;
CREATE TABLE ims.supplier (
	supplier_id uuid NOT NULL,
	name varchar(255) NOT NULL,
	contact_info varchar(255) NOT NULL,
	CONSTRAINT supplier_pk PRIMARY KEY (supplier_id)
);
-- ddl-end --
COMMENT ON COLUMN ims.supplier.supplier_id IS E'Unique identifier of the supplier';
-- ddl-end --
COMMENT ON COLUMN ims.supplier.name IS E'Name of the supplier';
-- ddl-end --
COMMENT ON COLUMN ims.supplier.contact_info IS E'Phone/email address of the supplier';
-- ddl-end --
ALTER TABLE ims.supplier OWNER TO ims_admin;
-- ddl-end --

-- object: ims.inventory | type: TABLE --
-- DROP TABLE IF EXISTS ims.inventory CASCADE;
CREATE TABLE ims.inventory (
	inventory_id uuid NOT NULL,
	product_id uuid NOT NULL,
	supplier_id uuid NOT NULL,
	quantity_on_hand integer NOT NULL,
	reorder_level integer NOT NULL,
	CONSTRAINT inventory_pk PRIMARY KEY (inventory_id)
);
-- ddl-end --
COMMENT ON COLUMN ims.inventory.inventory_id IS E'Unique inventory record';
-- ddl-end --
COMMENT ON COLUMN ims.inventory.product_id IS E'Unique identifier of the product';
-- ddl-end --
COMMENT ON COLUMN ims.inventory.supplier_id IS E'Unique identifier of the supplier';
-- ddl-end --
COMMENT ON COLUMN ims.inventory.quantity_on_hand IS E'Current stock';
-- ddl-end --
COMMENT ON COLUMN ims.inventory.reorder_level IS E'Threshold for restocking';
-- ddl-end --
ALTER TABLE ims.inventory OWNER TO ims_admin;
-- ddl-end --

-- object: ims.orders | type: TABLE --
-- DROP TABLE IF EXISTS ims.orders CASCADE;
CREATE TABLE ims.orders (
	order_id uuid NOT NULL,
	inventory_id uuid NOT NULL,
	order_date date NOT NULL,
	customer_id uuid NOT NULL,
	CONSTRAINT order_pk PRIMARY KEY (order_id)
);
-- ddl-end --
COMMENT ON COLUMN ims.orders.order_id IS E'Unique order identifier';
-- ddl-end --
COMMENT ON COLUMN ims.orders.inventory_id IS E'Unique identifier of the inventory item ordered';
-- ddl-end --
COMMENT ON COLUMN ims.orders.order_date IS E'When was the order placed';
-- ddl-end --
COMMENT ON COLUMN ims.orders.customer_id IS E'Unique identifier of the customer';
-- ddl-end --
ALTER TABLE ims.orders OWNER TO ims_admin;
-- ddl-end --

-- object: ims.customer | type: TABLE --
-- DROP TABLE IF EXISTS ims.customer CASCADE;
CREATE TABLE ims.customer (
	customer_id uuid NOT NULL,
	customer_name varchar(255) NOT NULL,
	contact_info varchar(255) NOT NULL,
	CONSTRAINT customer_pk PRIMARY KEY (customer_id)
);
-- ddl-end --
COMMENT ON COLUMN ims.customer.customer_id IS E'Unique identifier of the customer';
-- ddl-end --
COMMENT ON COLUMN ims.customer.customer_name IS E'Name of the customer';
-- ddl-end --
COMMENT ON COLUMN ims.customer.contact_info IS E'Customer contact details';
-- ddl-end --
ALTER TABLE ims.customer OWNER TO ims_admin;
-- ddl-end --

-- object: product_id_fk | type: CONSTRAINT --
-- ALTER TABLE ims.inventory DROP CONSTRAINT IF EXISTS product_id_fk CASCADE;
ALTER TABLE ims.inventory ADD CONSTRAINT product_id_fk FOREIGN KEY (product_id)
REFERENCES ims.product (product_id) MATCH SIMPLE
ON DELETE RESTRICT ON UPDATE NO ACTION;
-- ddl-end --
COMMENT ON CONSTRAINT product_id_fk ON ims.inventory IS E'Product ID is a Foreign Key to products table';
-- ddl-end --


-- object: supplier_id_fk | type: CONSTRAINT --
-- ALTER TABLE ims.inventory DROP CONSTRAINT IF EXISTS supplier_id_fk CASCADE;
ALTER TABLE ims.inventory ADD CONSTRAINT supplier_id_fk FOREIGN KEY (supplier_id)
REFERENCES ims.supplier (supplier_id) MATCH SIMPLE
ON DELETE RESTRICT ON UPDATE NO ACTION;
-- ddl-end --
COMMENT ON CONSTRAINT supplier_id_fk ON ims.inventory IS E'Supplier ID is a Foreign Key to suppliers table';
-- ddl-end --


-- object: inventory_id_fk | type: CONSTRAINT --
-- ALTER TABLE ims.orders DROP CONSTRAINT IF EXISTS inventory_id_fk CASCADE;
ALTER TABLE ims.orders ADD CONSTRAINT inventory_id_fk FOREIGN KEY (inventory_id)
REFERENCES ims.inventory (inventory_id) MATCH SIMPLE
ON DELETE RESTRICT ON UPDATE NO ACTION;
-- ddl-end --
COMMENT ON CONSTRAINT inventory_id_fk ON ims.orders IS E'inventory_id is a Foreign Key to inventory table';
-- ddl-end --


-- object: customer_id_fk | type: CONSTRAINT --
-- ALTER TABLE ims.orders DROP CONSTRAINT IF EXISTS customer_id_fk CASCADE;
ALTER TABLE ims.orders ADD CONSTRAINT customer_id_fk FOREIGN KEY (customer_id)
REFERENCES ims.customer (customer_id) MATCH SIMPLE
ON DELETE RESTRICT ON UPDATE NO ACTION;
-- ddl-end --
COMMENT ON CONSTRAINT customer_id_fk ON ims.orders IS E'customer_id is a Foreign Key to customer table';
-- ddl-end --



