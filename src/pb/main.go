// main.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

var baseOddsUrl = "https://api.the-odds-api.com/v4"
var apiKey = "a1dee53a9edc2521b8d5d361c677e755"

type UpcomingSports []struct {
	Key          string `json:"key"`
	Group        string `json:"group"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	Active       bool   `json:"active"`
	HasOutrights bool   `json:"has_outrights"`
}
type StandardBet struct {
	BetType      string    `json:"bet_type"`
	BetAmount    int       `json:"bet_amount"`
	Team         string    `json:"team"`
	HomeTeamName string    `json:"home_team_name"`
	AwayTeamName string    `json:"away_team_name"`
	GameID       string    `json:"game_id"`
	CommenceTime time.Time `json:"commence_time"`
	SportTitle   string    `json:"sport_title"`
	SportKey     string    `json:"sport_key"`
	Odds         struct {
		Name     string  `json:"name"`
		Price    int     `json:"price"`
		Point    float64 `json:"point"`
		TeamName string  `json:"team_name"`
	} `json:"odds"`
}
type StandardOdds [][]struct {
	ID           string    `json:"id"`
	SportKey     string    `json:"sport_key"`
	SportTitle   string    `json:"sport_title"`
	CommenceTime time.Time `json:"commence_time"`
	HomeTeam     string    `json:"home_team"`
	AwayTeam     string    `json:"away_team"`
	Bookmakers   []struct {
		Key        string    `json:"key"`
		Title      string    `json:"title"`
		LastUpdate time.Time `json:"last_update"`
		Markets    []struct {
			Key        string    `json:"key"`
			LastUpdate time.Time `json:"last_update"`
			Outcomes   []struct {
				Name  string  `json:"name"`
				Price int     `json:"price"`
				Point float64 `json:"point"`
			} `json:"outcomes"`
		} `json:"markets"`
	} `json:"bookmakers"`
}

func main() {
	app := pocketbase.New()
	addEndpoints(app)
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func addEndpoints(app core.App) {

	// api/clout/upcoming-sports
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/api/clout/upcoming-sports", func(c echo.Context) error {
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}
			file, _ := os.ReadFile("fakeapi/upcoming-sports.json")
			var upcomingSports UpcomingSports
			json.Unmarshal(file, &upcomingSports)
			return c.JSON(http.StatusOK, upcomingSports)
		}, apis.ActivityLogger(app))
		return nil
	})

	// api/clout/standard-odds
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/api/clout/standard-odds", func(c echo.Context) error {
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}
			qryResult := c.QueryParam("sports")
			sports := strings.Split(qryResult, ",")
			println(sports)
			file, _ := os.ReadFile("fakeapi/standard-odds.json")
			var standardOdds StandardOdds
			json.Unmarshal(file, &standardOdds)
			return c.JSON(http.StatusOK, standardOdds)
		}, apis.ActivityLogger(app))
		return nil
	})

	// api/clout/place-bet
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/api/clout/place-bet", func(c echo.Context) error {
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}
			queryParam := c.QueryParam("bet")
			var requestedBet StandardBet
			err := json.Unmarshal([]byte(queryParam), &requestedBet)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, "Error placing bet")
			}
			if verifyBetOdds(requestedBet) == 0 {
				return nil
			}
			return nil
		}, apis.ActivityLogger(app))
		return nil
	})

	// api/clout/hello
	type TestRes struct {
		Message string `json:"name"`
	}
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/api/clout/hello", func(c echo.Context) error {
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}
			test := &TestRes{
				Message: "Hello world!",
			}
			return c.JSON(200, test)
		}, apis.ActivityLogger(app))
		return nil
	})
}

func verifyBetOdds(requestedBet StandardBet) int {
	req, _ := http.NewRequest("GET", baseOddsUrl+"/sports/"+requestedBet.SportKey+"/odds/", nil)
	q := req.URL.Query()
	q.Add("apiKey", apiKey)
	q.Add("regions", "us")
	q.Add("markets", requestedBet.BetType)
	q.Add("bookmakers", "draftkings")
	q.Add("oddsFormat", "american")
	q.Add("eventIds", requestedBet.GameID)
	req.URL.RawQuery = q.Encode()
	b := req.URL.String()
	println(b)
	//res, _ := http.DefaultClient.Do(req)
	//if res.Close {
	//	return 0
	//}
	return 0
}
