'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Circle from "@/components/ui/circle";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState, useEffect, useRef} from "react";

const Page = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [studyTime, setStudyTime] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            return parseInt(localStorage.getItem('studyTime') || '25', 10);
        }
        return 25; // Default value for SSR
    });

    const [breakTime, setBreakTime] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            return parseInt(localStorage.getItem('breakTime') || '5', 10);
        }
        return 5; // Default value for SSR
    });

    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
    const [isStudy, setIsStudy] = useState<boolean>(true)
    const [isAlarm, setIsAlarm] = useState<boolean>(false);

    const handlePlay = () => {
        try {
            (audioRef.current as HTMLAudioElement).play();
            setIsAlarm(true);
        } catch (e) {
            console.log('Audio Not Found', e)
        }

    }

    const handlePause = () => {
        (audioRef.current as HTMLAudioElement).pause();
        setIsAlarm(false);
    }

    useEffect(() => {
        if(!isRunning) return

        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1, 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [isRunning])

    useEffect(() => {
        if(timeLeft === 0) {
            handlePlay()
            setIsRunning((prev) => !prev);
            setIsStudy((prev) => !prev);
            setTimeLeft(isStudy ? studyTime * 60 : breakTime * 60);
        }
    }, [isStudy, studyTime, breakTime, timeLeft]);

    useEffect(() => {
        setTimeLeft(isStudy ? studyTime * 60 : breakTime * 60);
    }, [isStudy, studyTime, breakTime])

    useEffect(() => {
        localStorage.setItem('studyTime', studyTime.toString());
        localStorage.setItem('breakTime', breakTime.toString());
    }, [studyTime, breakTime]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const calculateProgress = () => {
        const total = isStudy ? studyTime * 60 : breakTime * 60;
        return ((total - timeLeft) / total) * 100;
    }

    return (
        <main className={`grid gap-1 justify-center items-center w-full h-screen ${isAlarm ? "bg-red-600" : "bg-amber-200"} font-customFont`}>
            <audio loop ref={audioRef} src={'/nextjs-github-pages/alarm-clock-90867.mp3'} />
            <Card className='w-[350px] bg-amber-100 md:w-[500px]'>
                <CardHeader>
                    <CardTitle>Pomodoro Timer</CardTitle>
                    <CardDescription>Click opotions to review timers</CardDescription>
                </CardHeader>
                <CardContent className='flex justify-center'>
                    <Circle progress={calculateProgress()} text={formatTime(timeLeft)}/>
                </CardContent>
                <CardFooter className='flex justify-around'>
                    <Dialog>
                        <DialogTrigger>
                            <div
                                className='inline-flex bg-black items-center justify-center gap-2 whitespace-nowrap
                                    rounded-md text-sm font-medium transition-colors focus-visible:outline-none
                                    focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none
                                    disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4
                                    [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90
                                    h-9 px-4 py-2'
                            >
                                options
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Options</DialogTitle>
                            <DialogDescription>
                                Set your study time and break time in minutes
                            </DialogDescription>
                            <DialogHeader>
                                <div className='flex justify-around w-full'>
                                    <div className="">
                                        <Label>Study Time</Label>
                                        <Input
                                            className='w-[150px]'
                                            type="number"
                                            placeholder="Enter Min"
                                            value={studyTime}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setStudyTime(Math.max(1, Number(e.target.value)));
                                            }}
                                        />
                                    </div>
                                    <div className="">
                                        <Label>Break Time</Label>
                                        <Input
                                            className='w-[150px]'
                                            type="number"
                                            placeholder="Enter Min"
                                            value={breakTime}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setBreakTime(Math.max(1, Number(e.target.value)));
                                            }}
                                        />
                                    </div>
                                </div>

                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    {isRunning ? <Button className='w-1/8' onClick={() => setIsRunning(false)}>Stop</Button> :
                        <Button className='w-1/8' onClick={() => setIsRunning(true)}>Start</Button>
                    }
                </CardFooter>
            </Card>

            <div className='flex justify-center'>
                { isAlarm ? <Button onClick={handlePause} className='bg-red-600 hover:bg-red-950'>STOP ALARM</Button> : null}

            </div>

        </main>
    )
}
export default Page
