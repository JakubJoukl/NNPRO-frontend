import {CircularProgressWithLabel} from "./CircularProgressWithLabel.jsx";
import {useEffect, useRef, useState} from "react";

export function CircularWithValueLabel({validTo, validFrom, color, notifyExpired}) {
    const currentTime = Date.now(); // Current time in milliseconds
    const elapsed = currentTime - validFrom;
    const totalDuration = validTo - validFrom;
    const percentage = (elapsed / totalDuration) * 100;
    const [progress, setProgress] = useState(percentage);
    const expireEventSend = useRef(false);
    const remainingSeconds = Math.round((validTo - currentTime) / 1000);

    function formatTime(seconds) {
        if (seconds < 1000) {
            return `${seconds}s`; // Display seconds if under 100
        }
        const minutes = Math.floor(seconds / 60); // Convert to minutes
        if (minutes < 100) {
            return `${minutes}m`; // Display minutes if under 100
        }

        const hours = Math.floor(minutes / 60); // Convert to hours
        if (hours < 100) {
            return `${hours}h`; // Display hours if under 100
        }

        const days = Math.floor((hours) / 24); // Convert to days
        if (days < 100) {
            return `${days}d`; // Display days if under 100
        }

        const months = Math.floor(days / 30); // Approximate months (30 days per month)
        if (months < 100) {
            return `${months}mo`; // Display months if under 100
        }

        const years = Math.floor(months / 12); // Convert months to years
        return `${years}y`; // Display years if over 99 months
    }

    useEffect(() => {
        const timeout = remainingSeconds < 1500 ? 100 : 55_000
        const timer = setTimeout(() => {
            if (100 - percentage < 0) {
                setProgress(0);
                return;
            }
            setProgress(100 - percentage);
        }, 1000 / 10);
        return () => {
            clearInterval(timer);
        };
    }, [percentage]);

    if (currentTime >= validTo && !expireEventSend.current) {
        notifyExpired();
        expireEventSend.current = true;
    }

    return <CircularProgressWithLabel color={color} size={"1.8rem"} innerTextSize={"0.6rem"} value={progress}
                                      textValue={formatTime(remainingSeconds)}/>;
}