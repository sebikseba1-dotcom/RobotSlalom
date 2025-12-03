import { createRobutek } from "./libs/robutek.js"
import * as colors from "./libs/colors.js";
import { LED_WS2812B, SmartLed } from "smartled";
const robutek = createRobutek("V2");




const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B); // robutek.Pins.ILED je pin 48

ledStrip.set(0, colors.white); 
ledStrip.set(1, colors.white);
ledStrip.set(2, colors.white);
ledStrip.set(3, colors.white);
ledStrip.set(4, colors.white);
ledStrip.set(5, colors.white);
ledStrip.set(6, colors.white);

ledStrip.show(); 





const setpoint = 512;
let speed = 789;
let k_p = 0.96;
let k_d = 4.86;

function move(steering: number, speed: number) {
    if(steering < 0) {
        robutek.leftMotor.setSpeed((1 + steering) * speed)
        robutek.rightMotor.setSpeed(speed)
    } else if(steering > 0) {
        robutek.rightMotor.setSpeed((1 - steering) * speed)
        robutek.leftMotor.setSpeed(speed)
    }
}

async function main() {
    let previous_error = 0;
    robutek.leftMotor.move()
    robutek.rightMotor.move()
    console.log("start")
    while(true) {
        const l = robutek.readSensor("LineFR");
        let error = setpoint - l;
        let normalized_error = error / 512;
        let speed_of_change = normalized_error - previous_error;
        move(normalized_error * k_p + speed_of_change * k_d, speed);
        previous_error = normalized_error;
        await sleep(1);
    }
}

main().catch(console.error);

// do příště si chci udělat tlačítko, co zastaví program zkouska seba ok
