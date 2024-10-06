import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import Leaderboard from "../pages/Leaderboard.tsx";
import App from "../App.tsx";
import Profile from "../pages/Profile.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Leaderboard">
                <Leaderboard/>
            </ComponentPreview>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/Profile">
                <Profile/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;