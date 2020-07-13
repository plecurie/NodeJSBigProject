CREATE TABLE IF NOT EXISTS scala.database (
	"_id" text PRIMARY KEY,
	category text,
	contract_name text,
	"criteriaCategorieAverage" float,
	email text,
	euro_fees float,
	firm_name text,
	id_user text,
	isincode text,
	ongoingcharge float,
	password text,
	product_name text,
	type text,
	uc_fees float,
	criteria list<frozen<database_criteria>>,
	"employsExclusion" list<text>,
	products list<frozen<database_products>>,
	suggest list<frozen<completion>>,
	thematics list<text>)
	WITH ID = c4bba890-c472-11ea-96c3-537733e6a124
	AND bloom_filter_fp_chance = 0.01
	AND dclocal_read_repair_chance = 0.1
	AND crc_check_chance = 1.0
	AND default_time_to_live = 0
	AND gc_grace_seconds = 864000
	AND min_index_interval = 128
	AND max_index_interval = 2048
	AND memtable_flush_period_in_ms = 0
	AND read_repair_chance = 0.0
	AND speculative_retry = '99PERCENTILE'
	AND comment = ''
	AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
	AND compaction = { 'max_threshold': '32', 'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy' }
	AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
	AND cdc = false
	AND extensions = { 'elastic_admin/scala': '3a290a05fa847363616c61fa8676657273696f6ec28e6d617070696e675f76657273696f6ec48f73657474696e67735f76657273696f6ec2847374617465436f70656e8773657474696e6773fa92696e6465782e6372656174696f6e5f646174654c3135393436343636393137333192696e6465782e70726f76696465645f6e616d65447363616c6189696e6465782e75756964555648415941454c4c5358797a6648717a5465594d564194696e6465782e76657273696f6e2e637265617465644636303830343939fb876d617070696e6773f8fd058a44464c009c54bb7203210cfc176a1769d2b8cba4cf2f300aa7c34c384484707cf1dcbf47f835376e1cd3818484b4bbd2d10c20f00905cdf6683253469680a5dd1c087ae2b99d65cefac27ce1fc433c988d71dfd13a8a119d044aea2a21f988a2e745bd9484c1894d309d323f1bcf419003ac421316c1ebcf75b8a6bed56fdd356673d7c7085388f3475f259d0dec21d675e391927f80dad270bbf4f07e863ee0db1e19fc3ad31809e421013841881dc06365b2239e057021ed7f3f8e81a75ebac3606b41eea837a8ec1c0d3d1a53464835eb76c01d006728e5340acf8b5ba76ca8fdb371095f33f470366e31f7b3d18d5f536ba9deeb54ae207034655d026d236c0c2488f36fa3559743b3ab2d332ad17bb405333008b1f6215c71e5ca54424b61955ac60993dcde4c70506bae6223262f3bb37d7dd142ce427d7acb54d723f56559fe000000ffff0300f986616c6961736573fafbfbfb' };
CREATE CUSTOM INDEX elastic_database_idx ON scala.database () USING 'org.elassandra.index.ExtendedElasticSecondaryIndex';
