import React, { useState, useEffect, useRef } from 'react';
import { getMessageFromCore } from '../services/api';
import axios from 'axios';

function CoreTest() {
    // Core status message
    const [coreMessage, setCoreMessage] = useState('Checking Core server status...');
    // Error message (null means connected)
    const [error, setError] = useState<string | null>(null);
    // Last successful or failed check timestamp
    const [lastCheckDateTime, setLastCheckDateTime] = useState<string>('Never');
    // HTTP status code (200, 500, etc.)
    const [httpStatusCode, setHttpStatusCode] = useState<number | null>(null);
    // Response time in ms
    const [responseTime, setResponseTime] = useState<number | null>(null);
    // Countdown in seconds until next automatic check
    const [countdown, setCountdown] = useState<number>(0);

    // Interval references for cleanup
    const intervalRef = useRef<number | null>(null);
    const countdownIntervalRef = useRef<number | null>(null);

    // API endpoint and refresh interval
    const endpoint = 'http://127.0.0.1:5000/api/data';
    const refreshInterval = 300000; // 5 minutes in ms

    // Main fetch function
    const fetchCoreMessage = async () => {
        const startTime = performance.now();

        try {
            const data = await getMessageFromCore();
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));

            if (data && data.message) {
                setCoreMessage(data.message);
                setError(null);
                setHttpStatusCode(200);
            } else {
                setCoreMessage("Core couldn't fetch expected data format.");
                setError('Invalid data format from Core.');
                setHttpStatusCode(null);
            }
        } catch (err: any) {
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            console.error('Error fetching data from Core API:', err);

            if (axios.isAxiosError(err) && err.response) {
                setError(`Failed: ${err.message}`);
                setHttpStatusCode(err.response.status);
            } else {
                setError(`${err.message}.`);
                setHttpStatusCode(null);
            }

            setCoreMessage('Could not reach Core server.');
        } finally {
            // Update last check timestamp
            const now = new Date();

            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const formattedTime = new Intl.DateTimeFormat('tr-TR', timeOptions).format(now);

            const dateOptions: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
            const formattedDate = new Intl.DateTimeFormat('tr-TR', dateOptions).format(now);

            const dayOfWeekOptions: Intl.DateTimeFormatOptions = {
                weekday: 'long'
            };
            const dayOfWeek = new Intl.DateTimeFormat('en-US', dayOfWeekOptions).format(now);

            setLastCheckDateTime(`${formattedTime} on ${formattedDate}`);
            setCountdown(Math.floor(refreshInterval / 1000));
        }
    };

    // Starts polling and countdown intervals
    const startPolling = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

        fetchCoreMessage();

        intervalRef.current = setInterval(fetchCoreMessage, refreshInterval);

        setCountdown(Math.floor(refreshInterval / 1000));
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    };

    // On mount, start polling and setup cleanup
    useEffect(() => {
        startPolling();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, []);

    // Dynamically update browser tab title with status
    // useEffect(() => {
    //    const statusEmoji = error ? '🔴' : '🟢';
    //    const message = error ? '- Disconnected' : '- Connected';
    //    document.title = `${statusEmoji} Fyrane API ${message}`;
    //}, [error]);

    // Manual refresh handler
    const handleRefresh = () => {
        startPolling();
    };

    // Visual class and label based on status
    const statusClass = error ? 'cust-core-status-error' : 'cust-core-status-success';
    const statusText = error ? '🔴 - ' : '🟢 - ';

    return (
        <div className={`cust-core-status-box ${statusClass}`}>
            <p className="core-lead">
                <strong>{statusText}</strong>
                {error ? error : coreMessage}
            </p>

            <table className="core-table">
                <tbody>
                    <tr>
                        <td className="label">Endpoint:</td>
                        <td>{endpoint}</td>
                    </tr>
                    <tr>
                        <td className="label">Last Check:</td>
                        <td>{lastCheckDateTime}</td>
                    </tr>
                    { /* {httpStatusCode && (
                        <tr>
                            <td className="label">HTTP Status:</td>
                            <td>{httpStatusCode} {httpStatusCode === 200 ? '(OK)' : ''}</td>
                        </tr>
                    )}
                    responseTime !== null && (
                        <tr>
                            <td className="label">Response Time:</td>
                            <td>{responseTime} ms</td>
                        </tr>
                    ) }
                    <tr>
                        <td className="label">Next Check In:</td>
                        <td>{Math.floor(countdown / 60)}m {countdown % 60}s</td>
                    </tr>
                    */}
                </tbody>
            </table>

            <button onClick={handleRefresh} className="cust-button" id='refreshApiStat'> 
                Refresh Now
            </button>
        </div>

    );
}

export default CoreTest;
