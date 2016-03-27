package model

import (
	"rizki/rab/api/config"

	"github.com/jinzhu/gorm"
)

func initDb() *gorm.DB {
	db, err := gorm.Open(config.DRIVER, config.CONN)
	if err != nil {
		panic(err.Error())

	}
	db.SingularTable(true)
	//db.LogMode(true)
	return db
}
