import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Grid, DialogContent, DialogContentText, TextField, InputAdornment, IconButton, DialogActions, Button } from "@mui/material"


export const UserForm = ({
    onSetCreateModal,
    handleSubmit,
    values,
    touched,
    handleChange,
    handleBlur,
    errors,
    showPassword,
    hiddeButton,
    handleClickShowPassword,
    saveUpdate,
    cancelUpdate }: any) => {




    return (
        <Grid item={true} xs={12}
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& .MuiTextField-root': {
                    m: 1,
                    width: '25ch',
                },
                '& .MuiButton-root': {
                    m: 1,
                    width: '20ch',
                },
            }}
            noValidate
            autoComplete="off">
            <DialogContent>
                <DialogContentText>

                    <TextField
                        fullWidth
                        size="small"
                        name="userName"
                        label="Nick Name"
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.userName && Boolean(errors.userName)}
                        helperText={touched.userName && errors.userName}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="fullName"
                        label="Nombre completo"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.fullName && Boolean(errors.fullName)}
                        helperText={touched.fullName && errors.fullName}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="avatar"
                        label="Avatar"
                        value={values.avatar}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.avatar && Boolean(errors.avatar)}
                        helperText={touched.avatar && errors.avatar}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="password"
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="passwordConfirmation"
                        label="Confirmar contraseña"
                        type={showPassword ? "text" : "password"}
                        value={values.passwordConfirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.passwordConfirmation && Boolean(errors.passwordConfirmation)}
                        helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />


                </DialogContentText>
            </DialogContent>



            <DialogActions>
                {hiddeButton ? <Button
                    variant="contained"
                    type="submit"
                    color="primary">
                    Guardar
                </Button> :
                    <Button
                        variant="contained"
                        type="button"
                        color="info"
                        onClick={saveUpdate}>
                        Editar
                    </Button>
                }
                <Button autoFocus variant="outlined" onClick={() => {
                    onSetCreateModal(false)
                    cancelUpdate()
                }}>
                    Cancelar
                </Button>

            </DialogActions>

        </Grid>
    )
}
