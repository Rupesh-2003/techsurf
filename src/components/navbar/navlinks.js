const { useRouter } = require("next/router")

const Navlinks = ({link, text, logo}) => {
    const Router = useRouter()
    const {pathname} = Router

    const onClickHandler = () => {
        if (pathname == "/"+link) {
            return
        }
        else if (link == 'Logout') {

        }
        else {
            Router.push("/"+link)
        }
    }

    return (
        <div className={`flex flex-row gap-x-[20px] px-[16px] py-[12px] box-border items-center ${pathname == "/"+link && "bg-purple-light fade-bg"}  rounded-[10px] cursor-pointer`}
            onClick={onClickHandler}
        >
            <img src={"/icons/" + logo} alt={logo + "logo"}/>
            <div>{text}</div>
        </div>
    )
}

export default Navlinks