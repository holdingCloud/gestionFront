import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
    title: string;
    content: string;
    open: boolean;
    onClose: (action: boolean) => void;
}

export const BillModal = ({ title, content, open, onClose }: Props) => {
    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            aria-labelledby="draggable-dialog-title"
            maxWidth={'xl'}
            fullWidth={true}

        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus variant="outlined" onClick={() => onClose(false)}>
                    Agregar Cuenta
                </Button>
                <Button color="error" variant="outlined" onClick={() => onClose(true)}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    )
}
