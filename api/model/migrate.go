package model

func Migrate() {
	db := initDb()
	db.AutoMigrate(&User{}, &Role{}, &Barang{}, &Supplier{})
	//db.Model(&User{}).AddForeignKey("role_id", "role(id)", "RESTRICT", "RESTRICT")
}
