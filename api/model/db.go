package model

import "github.com/jinzhu/gorm"

func initDb() *gorm.DB {
	db, err := gorm.Open("mysql", "homestead:secret@tcp(192.168.10.10:3306)/rab")
	if err != nil {
		panic(err.Error())

	}
	db.SingularTable(true)
	db.LogMode(true)
	return db
}
