//% deprecated
namespace robotbit {

}

namespace modules {
    /**
     * Motor 1A
     */
    //% fixedInstance whenUsed block="robotbit motor 1A"
    export const robotbitMotor1A = new MotorClient("robotbit motor 1A?dev=self&srvo=0")
    /**
     * Motor 1B
     */
    //% fixedInstance whenUsed block="robotbit motor 1B"
    export const robotbitMotor1B = new MotorClient("robotbit motor 1B?dev=self&srvo=1")
    /**
     * Motor 2A
     */
    //% fixedInstance whenUsed block="robotbit motor 2A"
    export const robotbitMotor2A = new MotorClient("robotbit motor 2A?dev=self&srvo=2")
    /**
     * Motor 2B
     */
    //% fixedInstance whenUsed block="robotbit motor 2B"
    export const robotbitMotor2B = new MotorClient("robotbit motor 2B?dev=self&srvo=3")

    /**
     * Servo S1
     */
    export const robotbitServoS1 = new ServoClient("robotbit servo S1?dev=self&srvo=0&name=S1")
    /**
     * Servo S2
     */
    export const robotbitServoS2 = new ServoClient("robotbit servo S2?dev=self&srvo=1")
    /**
     * Servo S3
     */
    export const robotbitServoS3 = new ServoClient("robotbit servo S3?dev=self&srvo=2")
    /**
     * Servo S4
     */
    export const robotbitServoS4 = new ServoClient("robotbit servo S4?dev=self&srvo=3")
    /**
     * Servo S5
     */
    export const robotbitServoS5 = new ServoClient("robotbit servo S5?dev=self&srvo=4")
    /**
     * Servo S6
     */
    export const robotbitServoS6 = new ServoClient("robotbit servo S6?dev=self&srvo=5")
    /**
     * Servo S7
     */
    export const robotbitServoS7 = new ServoClient("robotbit servo S7?dev=self&srvo=6")
    /**
     * Servo S8
     */
    export const robotbitServoS8 = new ServoClient("robotbit servo S8?dev=self&srvo=7")
}

namespace servers {
    jacdac.productIdentifier = 0x3dffd752
    class MotorServer extends jacdac.Server {
        motor: robotbit.Motors
        speed: number
        enabled: boolean

        constructor(motor: robotbit.Motors, instanceName: string) {
            super(jacdac.SRV_MOTOR, { instanceName: instanceName })
            this.motor = motor
            this.enabled = false

            robotbit.MotorStop(this.motor)
        }

        handlePacket(pkt: jacdac.JDPacket) {
            this.handleRegValue(pkt, jacdac.MotorReg.Reversible, jacdac.MotorRegPack.Reversible, true)
            this.speed = this.handleRegValue(pkt, jacdac.MotorReg.Speed, jacdac.MotorRegPack.Speed, this.speed)
            this.enabled = this.handleRegBool(pkt, jacdac.MotorReg.Enabled, this.enabled)

            this.sync()
        }

        sync() {
            if (!this.enabled || this.speed == 0)
                robotbit.MotorStop(this.motor)
            else {
                robotbit.MotorRun(this.motor, this.speed * 0xff)
            }
        }
    }
    class ServoServer extends jacdac.Server {
        servo: robotbit.Servos
        angle: number
        constructor(servo: robotbit.Servos, instanceName: string) {
            super(jacdac.SRV_SERVO, { instanceName: instanceName })
            this.servo = servo
            this.angle = 0
        }
        handlePacket(pkt: jacdac.JDPacket) {
            this.angle = this.handleRegValue(pkt, jacdac.ServoReg.Angle, jacdac.ServoRegPack.Angle, this.angle)
            this.handleRegValue(pkt, jacdac.ServoReg.ActualAngle, jacdac.ServoRegPack.ActualAngle, this.angle)

            robotbit.Servo(this.servo, this.angle)
        }
    }
    function start() {
        jacdac.productIdentifier = 0x31ea8476
        jacdac.deviceDescription = "Kittenbot Robo:bit"
        jacdac.startSelfServers(() => [
            // motors
            new MotorServer(robotbit.Motors.M1A, "M1A"),
            new MotorServer(robotbit.Motors.M1B, "M1B"),
            new MotorServer(robotbit.Motors.M2A, "M2A"),
            new MotorServer(robotbit.Motors.M2B, "M2B"),
            // servos
            new ServoServer(robotbit.Servos.S1, "S1"),
            new ServoServer(robotbit.Servos.S2, "S2"),
            new ServoServer(robotbit.Servos.S3, "S3"),
            new ServoServer(robotbit.Servos.S4, "S4"),
            new ServoServer(robotbit.Servos.S5, "S5"),
            new ServoServer(robotbit.Servos.S6, "S6"),
            new ServoServer(robotbit.Servos.S7, "S7"),
            new ServoServer(robotbit.Servos.S8, "S8"),
        ])
    }
    start()
}