package main

import (
	"github.com/hybridgroup/gobot"
	"github.com/hybridgroup/gobot/api"
	"github.com/hybridgroup/gobot/platforms/sphero"
	"time"
)

func main() {
	gbot := gobot.NewGobot()
	api := api.NewAPI(gbot)
	api.Port = "8080"
	api.Start()

	adaptor := sphero.NewSpheroAdaptor("Sphero", "/dev/tty.Sphero-YBW-RN-SPP")
	driver := sphero.NewSpheroDriver(adaptor, "sphero")

	robot := gobot.NewRobot("sphero-dpad",
		[]gobot.Connection{adaptor},
		[]gobot.Device{driver},
		func() {},
	)

	robot.AddCommand("move", func(params map[string]interface{}) interface{} {
		direction := params["direction"].(string)

		switch direction {
		case "up":
			driver.Roll(100, 0)
		case "down":
			driver.Roll(100, 180)
		case "left":
			driver.Roll(100, 270)
		case "right":
			driver.Roll(100, 90)
		}

		time.Sleep(2 * time.Second)
		driver.Stop()
		return "ok"
	})

	gbot.AddRobot(robot)

	gbot.Start()
}
