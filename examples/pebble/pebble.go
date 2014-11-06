package main

import (
	"github.com/hybridgroup/gobot"
	"github.com/hybridgroup/gobot/api"
	"github.com/hybridgroup/gobot/platforms/pebble"
)

func main() {
	gbot := gobot.NewGobot()
	api := api.NewAPI(gbot)
	adaptor := pebble.NewPebbleAdaptor("pebble")

	api.Port = "8080"

	robot := gobot.NewRobot("pebble",
		[]gobot.Connection{adaptor},
		[]gobot.Device{pebble.NewPebbleDriver(adaptor, "pebble")},
		func() {},
	)

	gbot.AddRobot(robot)
	api.Start()
	gbot.Start()
}
