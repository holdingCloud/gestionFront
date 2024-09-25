import { Container, Grid } from "@mui/material";
import { UrlBreadCrumbs } from "../../components";



export const BuyPage = () => {
    return (
        <Container
            maxWidth={false} disableGutters>

            <UrlBreadCrumbs />

            <Grid
                sx={{
                    bgcolor: '#FFF',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    marginBottom: 2,
                    padding: 5
                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}
            >

            </Grid>
        </Container>
    )
}

export default BuyPage;