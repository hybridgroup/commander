package main

import (
	"github.com/hybridgroup/gobot"
	"github.com/hybridgroup/gobot/api"
	"github.com/hybridgroup/gobot/platforms/sphero"
)

func main() {
	gbot := gobot.NewGobot()
	api := api.NewAPI(gbot)
	api.Port = "8080"
	api.Start()

	adaptor := sphero.NewSpheroAdaptor("Sphero", "/dev/tty.Sphero-YBW-RN-SPP")
	driver := sphero.NewSpheroDriver(adaptor, "sphero")

	r := 122
	g := 122
	b := 122

	work := func() {
		driver.SetRGB(uint8(r), uint8(g), uint8(b))
	}

	changeColor := func(color *int, delta int) string {
		newColor := *color + delta

		if newColor > 0 && newColor < 255 {
			*color = newColor
			driver.SetRGB(uint8(r), uint8(g), uint8(b))
		}

		return "ok"
	}

	robot := gobot.NewRobot("sphero-list",
		[]gobot.Connection{adaptor},
		[]gobot.Device{driver},
		work,
	)

	robot.AddCommand("increase_red", func(params map[string]interface{}) interface{} {
		return changeColor(&r, 10)
	})

	robot.AddCommand("decrease_red", func(params map[string]interface{}) interface{} {
		return changeColor(&r, -10)
	})

	robot.AddCommand("increase_green", func(params map[string]interface{}) interface{} {
		return changeColor(&g, 10)
	})

	robot.AddCommand("decrease_green", func(params map[string]interface{}) interface{} {
		return changeColor(&g, -10)
	})

	robot.AddCommand("increase_blue", func(params map[string]interface{}) interface{} {
		return changeColor(&b, 10)
	})

	robot.AddCommand("decrease_blue", func(params map[string]interface{}) interface{} {
		return changeColor(&b, -10)
	})

	gbot.AddRobot(robot)

	gbot.Start()
}
