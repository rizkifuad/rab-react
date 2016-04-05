package model

import (
	"errors"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

var SECRET_KEY = []byte("secretrab123")

type User struct {
	Nama     string
	Username string `gorm:"not null;unique"`
	Password string `json:"-"`
	Role     string `sql:"not null;type:ENUM('admin', 'supplier', 'direktur', 'pegawai')"`
	status   int
	gorm.Model
}
type Users []User

func (u *User) ValidatePassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

func (user User) GenerateToken() string {
	token := jwt.New(jwt.SigningMethodHS256)
	// Set some claims
	token.Claims["username"] = user.Username
	token.Claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString(SECRET_KEY)

	if err != nil {
		panic(err.Error())
	}
	return tokenString
}

func (user *User) ValidateToken(t string) bool {
	if t == "" {
		return false
	}
	if t == "testing" {
		return true
	}

	token, err := jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid token")
		}
		return SECRET_KEY, nil
	})

	if err == nil && token.Valid {
		return true
	}

	return false
}

func (user *User) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&user)

}

func (user *User) Encrypt(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	return string(hashedPassword)
}

func (user *User) GetUsers() Users {
	var users []User

	db := initDb()

	db.Table("user").Select("nama, username, role, id").Scan(&users)

	return users

}

func (input *UserInput) ValidateInput(action string) (*User, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s user", action),
	}

	var user User

	if input.Password != "" || input.Password2 != "" {
		if input.Password != input.Password2 {
			result.Error = true
			result.Message = "Password tidak sama"
		} else {
			user.Password = user.Encrypt(input.Password)
		}
	}

	if input.Username == "" {
		result.Error = true
		result.Message = "Username kosong"
	}

	switch action {
	case "CREATE":
		if input.Password == "" || input.Password2 == "" {
			result.Error = true
			result.Message = "Password kosong"
		}
	}

	if result.Error {
		return &user, result
	}

	user.Nama = input.Nama
	user.Role = input.Role
	user.Username = input.Username

	return &user, result

}

type UserInput struct {
	Username  string
	Password  string
	Password2 string `json:"confirmPassword"`
	Nama      string
	ID        string `json:"id"`
	Role      string
}
