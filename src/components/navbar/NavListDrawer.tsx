import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

interface Props {
    to: string;
    name: string;
    icon: any;
}


export const NavListDrawer = ({ to, name, icon }: Props) => {
    return (


        <List>
            <ListItem
                key={to}
                disablePadding>
                <ListItemButton
                    component={NavLink}
                    to={to}>
                    <ListItemIcon>
                        {icon}
                    </ListItemIcon>
                    <ListItemText >
                        {name}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        </List>

    )
}
