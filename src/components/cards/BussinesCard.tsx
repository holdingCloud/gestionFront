import { Box, Button, Grid, Paper, Typography } from "@mui/material"
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const BussinesCard = () => {

    return (
        <>
            <Grid
                item={true} xs={12} sm={6} md={4} lg={3}>
                <Paper
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        overflow: "hidden",
                        mt: 5,
                        padding: 2,
                        borderRadius: 3,
                        boxShadow: 10
                    }}>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, padding: 1 }}>
                        <TrendingUpIcon sx={{
                            width: 100,
                            height: 50,
                            color: "seagreen"
                        }} />
                        <Typography variant="h5"
                            sx={{ textAlign: "center" }}
                        > $3.000.000</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, mr: 1, padding: 1 }}>
                        <Typography variant="h4"
                            sx={{
                                fontSize: 30,
                                textAlign: "center"
                            }}> Ventas</Typography>
                        <Button color="primary" variant="outlined" sx={{ borderRadius: 5, }}> Ver </Button>

                    </Box>

                </Paper>
            </Grid>

            <Grid
                item={true} xs={12} sm={6} md={4} lg={3}>

                <Paper
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        overflow: "hidden",
                        mt: 5,
                        padding: 2,
                        borderRadius: 3,
                        boxShadow: 10,
                    }}>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, padding: 1 }}>
                        <TrendingUpIcon sx={{
                            width: 100,
                            height: 50,
                            color: "seagreen"
                        }} />
                        <Typography variant="h5"
                            sx={{ textAlign: "center" }}
                        > $3.000.000</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, mr: 1, padding: 1 }}>
                        <Typography variant="h4"
                            sx={{
                                fontSize: 30,
                                textAlign: "center"
                            }}> Gastos</Typography>

                        <Button color="primary" variant="outlined" sx={{ borderRadius: 5 }}> Ver</Button>

                    </Box>

                </Paper>
            </Grid>

            <Grid
                item={true} xs={12} sm={6} md={4} lg={3}>

                <Paper
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        overflow: "hidden",
                        mt: 5,
                        padding: 2,
                        borderRadius: 3,
                        boxShadow: 10,
                    }}>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, padding: 1 }}>
                        <TrendingUpIcon sx={{
                            width: 100,
                            height: 50,
                            color: "seagreen"
                        }} />
                        <Typography variant="h5"
                            sx={{ textAlign: "center" }}
                        > $3.000.000</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, mr: 1, padding: 1 }}>
                        <Typography variant="h4"
                            sx={{
                                fontSize: 30,
                                textAlign: "center"
                            }}> Impuesto</Typography>

                        <Button color="primary" variant="outlined" sx={{ borderRadius: 5 }}> Ver </Button>

                    </Box>

                </Paper>
            </Grid>

            <Grid
                item={true} xs={12} sm={6} md={4} lg={3}>

                <Paper
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        overflow: "hidden",
                        mt: 5,
                        padding: 2,
                        borderRadius: 3,
                        boxShadow: 10,
                    }}>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, padding: 1 }}>

                        <TrendingUpIcon sx={{
                            width: 100,
                            height: 50,
                            color: "seagreen"
                        }} />
                        <Typography variant="h5"
                            sx={{ textAlign: "center" }}
                        > $3.000.000</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: "grid", gap: 2, mr: 1, padding: 1 }}>
                        <Typography variant="h4"
                            sx={{
                                fontSize: 30,
                                textAlign: "center"
                            }}> Compras</Typography>

                        <Button color="primary" variant="outlined" sx={{ borderRadius: 5 }}> Ver </Button>

                    </Box>

                </Paper>
            </Grid>





        </>

    )
}
