CREATE TABLE "public"."widgets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" "text",
    "price" numeric,
    "description" "text"
);
ALTER TABLE ONLY "public"."widgets"
    ADD CONSTRAINT "widgets_pkey" PRIMARY KEY ("id");

INSERT INTO "public"."widgets" ("name", "price", "description") 
VALUES 
    ('ball', 1.99, 'standard red playground ball'),
    ('hammer', 14.99, '16oz hammer'),
    ('dish strainer', 4.29, 'anodized dish strainer'),
    ('sprocket', 44.00, 'internal 40xtn sprocket'),
    ('40 watt bulb', 8.79, 'standard socket bulb: 40w equivalent output'),
    ('fairy dust', 0.99, 'small packet of magical powder'),
    ('any key', 4.50, 'the famous "any key" keyboard replacement key'),
    ('cup o'' joe', 3.99, 'world-famous Columbian coffee in a collector mug'),
    ('small potion bottle', 9.99, 'bottle for storing potions: 30ml capacity'),
    ('smoke', 0.00, 'you can''t put it back into the computer'),
    ('wooden nickel', 0.05, 'don''t take this');
    
CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_widget_timestamp" 
BEFORE UPDATE ON "widgets"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();