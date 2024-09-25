import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useAuthStore } from '../../store';
import { Box, DialogContentText, Typography } from '@mui/material';


interface Props {
    title: string;
    open: boolean;
    onClose: (action: boolean) => void;
}





export const SessionModal = ({ title, open, onClose }: Props) => {

    const logoutUser = useAuthStore(state => state.logoutUser);

    const renderTime = ({ remainingTime }: any) => {
        if (remainingTime === 0) {
            logoutUser();
            return <Box >Too lale...</Box>;
        }

        return (
            <Box >

                <Typography>{remainingTime}</Typography>
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{
                    alignContent: 'center'
                }}>
                    <CountdownCircleTimer
                        isPlaying
                        duration={60}
                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                        colorsTime={[60, 50, 30, 10]}
                        onComplete={() => ({ shouldRepeat: true, delay: 1 })}
                    >
                        {renderTime}
                    </CountdownCircleTimer>

                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button color="info" onClick={() => onClose(false)}>
                    Mantener sesión
                </Button>
                <Button color="warning" onClick={logoutUser}>
                    Cerrar sesión
                </Button>
            </DialogActions>
        </Dialog>
    );
}
