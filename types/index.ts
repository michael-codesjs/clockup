import Entities from "@entities";
import { auth } from "@lib/amplify";
import { AlarmRingTime, AlarmSnoozeSettings } from "./api";


export type SignInCredentials = { username: string, password: string };
export type SignUpCredentials = { name: string, email: string, password: string };

export type AbsoluteUser = ReturnType<typeof Entities.User<{ id: string, email: string, name: string }>>;
export type NullUser = ReturnType<typeof Entities.User<{ id: string }>>;

export type AbsoluteAlarm = ReturnType<typeof Entities.Alarm<{ creator: NullUser, time: AlarmRingTime, snooze: AlarmSnoozeSettings }>>;
export type NullAlarm = ReturnType<typeof Entities.Alarm<{ id: string }>>;

export type ISignUpResult = Awaited<ReturnType<typeof auth.signUp>>
