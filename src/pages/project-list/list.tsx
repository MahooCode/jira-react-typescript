import { Button, Table, TableProps } from "antd";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useEditProject } from "utils/project";

export interface Project {
  id: number;
  // id: string;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}
export interface User {
  id: number;
  name: string;
  token: string;
}

interface ListProps extends TableProps<Project> {
  users: User[];
  refresh: () => void;
}

const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject();
  const pinProject = (id: number) => (pin: boolean) =>
    mutate({ id, pin }).then(() => {
      props.refresh();
    });
  return (
    <Table
      rowKey={"id"}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return (
              <Pin
                checked={project.pin}
                // onCheckedChange={(pin) => mutate({ id: project.id, pin })}
                // 柯里化
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "项目",
          // dataIndex: "name",
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "部门",
          dataIndex: "organization",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },

        {
          title: "负责人",
          dataIndex: "personId",
          render: (value, project) => {
            return (
              <span>
                {users.find((user) => user.id === Number(project.personId))
                  ?.name || "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "created",
          sorter: (a, b) => a.created - b.created,
          render: (value, project) => {
            return (
              <span>
                {project.created
                  ? dayjs(project.created).format("YYYY-MM-DD")
                  : "未知"}
              </span>
            );
          },
        },
      ]}
      pagination={false}
      {...props}
    ></Table>
  );
};

export default List;
