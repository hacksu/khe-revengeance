import { useState } from "react";
import { SupportTicket } from "../../global-includes/support-ticket";
import { remult } from "remult";

import KHELayout from "../layouts/layout";


export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    useEffect(() => {

    }, []);
    const getMenu = () => {

    };
    return <KHELayout>
        <Layout style={{ height: "100%" }}>
            <Sider width={200} theme="light">
                <Menu title="Email Lists" mode="inline" onClick={menuNavigation}
                    items={getMenu()} selectedKeys={composing ? "__compose" : [list]}
                    defaultOpenKeys={["__list"]} defaultSelectedKeys={["__compose"]}
                    className={layoutStyle.sidebarWidth} />
                {addingList ? <Input
                    ref={newListInput} placeholder="Name of new list"
                    onPressEnter={addList}
                    suffix={<PlusOutlined onClick={addList} />}
                /> :
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <Button onClick={() => setAddingList(true)}><PlusCircleOutlined /></Button>
                    </div>
                }
            </Sider>
            <Layout>Content here</Layout>
        </Layout>
    </KHELayout>;
}
