package main

import (
	"fmt"
	"github.com/hybridgroup/gobot"
	"github.com/hybridgroup/gobot/api"
)

func main() {
	gbot := gobot.NewGobot()
	api := api.NewAPI(gbot)
	api.Port = "8080"

	work := func() {}

	robot := gobot.NewRobot("joystick",
		[]gobot.Connection{},
		[]gobot.Device{},
		work,
	)

	robot.AddCommand("joystick_event", func(params map[string]interface{}) interface{} {
		value := params["name"].(string) + ": " + params["position"].(string)
		fmt.Println(value)
		return value
	})

	robot.AddCommand("button_event", func(params map[string]interface{}) interface{} {
		value := params["name"].(string) + ": " + params["action"].(string)
		fmt.Println(value)
		return params["name"]
	})

	gbot.AddRobot(robot)
	api.Start()
	gbot.Start()
}
