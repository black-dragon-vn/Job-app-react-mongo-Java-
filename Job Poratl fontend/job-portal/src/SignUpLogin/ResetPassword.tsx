import { Button, Modal, PasswordInput, PinInput, rem, TextInput } from "@mantine/core"
import { IconAt, IconLock } from "@tabler/icons-react"
import { useState } from "react";
import { changePass, sendOtp, verifyOtp } from "../Services/UserService";
import { signupValidation } from "../Services/FormValidation";
import { errNotification, sucessNotification } from "../Services/NotificationService";
import { useInterval } from "@mantine/hooks";

interface ResetPasswordProps {
  opened: boolean;
  close: () => void;
}

const ResetPassword = ({ opened, close }: ResetPasswordProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passErr, setPassErr] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [verified, setVerified] = useState(false);
    const [resendLoader, setResendeLoader] = useState(false);
    const [seconds, setSeconds] = useState(60);
    const interval = useInterval(() => {
        if (seconds === 0) {
            setResendeLoader(false);
            setSeconds(60);
            // eslint-disable-next-line react-hooks/immutability
            interval.stop();
        }else setSeconds((s) => s - 1)
    }, 1000);
    const handleSendOtp = () => {
        setOtpSending(true);
        sendOtp(email).then((res) => {
            console.log(res)
            sucessNotification("OTP Sent Successefully", "Please enter OTP to reset.")
            setOtpSent(true);
            setOtpSending(false);
            setResendeLoader(true);
            interval.start();
        }).catch((err) => {
            console.log(err);
            errNotification("OTP sending Failed", err.response.data.errorMessage);
            setOtpSending(false);
        })
    };

    const handleVerifyOtp = (otp: string) => {
        verifyOtp(email, otp).then((res) => {
            console.log(res);
            sucessNotification("OTP Verified.", "Enter new password to reset.")
            setVerified(true);
        }).catch((err) => {
            errNotification("OTP Verification Failed", err.response.data.errorMessage);
            console.log(err);
        })
    };
    const reSendOtp = () => {
        if(resendLoader) return;
        handleSendOtp();
    }
    const changeEmail = () => {
        setOtpSent(false);
        setResendeLoader(false);
        setSeconds(60);
        setVerified(false);
        interval.stop();

    }
    const handleRestPassword = () => {
        changePass(email, password).then((res) => {
            console.log(res);
            sucessNotification("Password changed.", "Login with new password.");
            close();
        }).catch((err) => {
            errNotification("Password changed Failed", err.response.data.errorMessage);
            console.log(err);
        })
    }
    return <Modal opened={opened} onClose={close} title="Reset Password">
        <div className="flex flex-col gap-6">
            {/* Email Input */}
            <div className="group/input relative">
                <TextInput
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    withAsterisk
                    rightSection={<Button
                        size="xs"
                        className="mr-1"
                        autoContrast
                        onClick={handleSendOtp}
                        variant="filled"
                        disabled={email === "" || otpSent}
                        loading={otpSending && !otpSent}
                    >Send OTP</Button>}
                    rightSectionWidth={90}
                    label='Email'
                    placeholder="your.email@example.com"
                    leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} className="text-cyan-400" />}
                    classNames={{
                        input: "!bg-mine-shaft-900/80 !border-2 !border-mine-shaft-700 focus:!border-cyan-400 hover:!border-cyan-500/50 !text-white !transition-all !duration-300 !rounded-lg focus:!shadow-lg focus:!shadow-cyan-500/20 !placeholder-mine-shaft-500",
                        label: "!text-cyan-400 !font-bold mb-2 text-base group-focus-within/input:!text-cyan-300 !transition-colors"
                    }}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within/input:from-cyan-500/10 group-focus-within/input:to-blue-500/10 pointer-events-none transition-all duration-300 -z-10" />
            </div>
            {otpSent && <PinInput
                onComplete={handleVerifyOtp}
                length={6}
                className="mx-auto"
                size="md" gap="lg"
                type="number" />
            }
            {otpSent && !verified &&
                <div className="flex gap-4">
                    {<Button
                        size="xs"
                        className="mr-1"
                        autoContrast
                        onClick={reSendOtp}
                        variant="light"
                        loading={otpSending}
                        fullWidth
                    >{resendLoader?seconds:"Resend"}</Button>}
                    {<Button
                        size="xs"
                        className="mr-1"
                        autoContrast
                        onClick={changeEmail}
                        variant="filled"
                        loading={otpSending && !otpSent}
                        fullWidth
                    >Change Email</Button>}
                </div>
            }
            {verified &&
                <div className="group/input relative">
                    <PasswordInput
                        error={passErr}
                        name="password"
                        onChange={(e) => { setPassword(e.target.value); setPassErr(signupValidation("password", e.target.value)) }}
                        value={password}
                        withAsterisk
                        leftSection={<IconLock style={{ width: rem(18), height: rem(18) }} stroke={1.5} className="text-cyan-400" />}
                        label='Password'
                        placeholder="••••••••"
                        classNames={{
                            input: "!bg-mine-shaft-900/80 !border-2 !border-mine-shaft-700 focus:!border-cyan-400 hover:!border-cyan-500/50 !text-white !transition-all !duration-300 !rounded-lg focus:!shadow-lg focus:!shadow-cyan-500/20",
                            label: "!text-cyan-400 !font-bold mb-2 text-base group-focus-within/input:!text-cyan-300 !transition-colors",
                            innerInput: "!bg-transparent !text-white !placeholder-mine-shaft-500"
                        }}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within/input:from-cyan-500/10 group-focus-within/input:to-blue-500/10 pointer-events-none transition-all duration-300 -z-10" />
                </div>
            }
            {verified && <Button
                autoContrast
                onClick={handleRestPassword}
                variant="filled"
                loading={otpSending}
                fullWidth
            >Change Pass</Button>}

        </div>
    </Modal>
}
export default ResetPassword