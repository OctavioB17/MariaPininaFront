export default interface DropDownMenuProps {
    menuName: string,
    menuList: string[],
    linkTo: string,
    subMenusLinks?: string[],
    queryParamName?: string ,
}