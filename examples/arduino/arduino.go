package main

import (
	"github.com/hybridgroup/gobot"
	"github.com/hybridgroup/gobot/api"
	"github.com/hybridgroup/gobot/platforms/firmata"
	"github.com/hybridgroup/gobot/platforms/gpio"
)

func main() {
	gbot := gobot.NewGobot()
	api := api.NewAPI(gbot)
	adaptor := firmata.NewFirmataAdaptor("arduino", "/dev/ttyACM0")
	led := gpio.NewLedDriver(adaptor, "led", "13")

	api.Port = "8080"

	robot := gobot.NewRobot("arduino",
		[]gobot.Connection{adaptor},
		[]gobot.Device{led},
		func() {},
	)

	led.AddCommand("turn_on", func(params map[string]interface{}) interface{} {
		return led.On()
	})

	led.AddCommand("turn_off", func(params map[string]interface{}) interface{} {
		return led.Off()
	})

	gbot.AddRobot(robot)
	api.Start()
	gbot.Start()
}
