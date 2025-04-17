import { captureOwnerStack, useState, useEffect } from 'react';
import styles from './App.module.css';
import { GroupItem } from './components/GroupItem/GroupItem.tsx';
import { Status } from './components/Status/Status.tsx';
import { StatusKey, StatusValues } from './utils/statusColor.tsx';
import { NodeItem } from './components/NodeItem/NodeItem.tsx';
import { Metrics } from './components/Metrics/Metrics.tsx';

type GroupsData = {
  group_caption: string;
  node_caption: string;
  node_status_color: string;
  node_status_description: string;
  interface_caption: string;
  interface_status_color: string;
  interface_status_description: string;
  application_caption: string;
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
};

type NodeData = {
  datetime: string;
  cpu_utilization: number;
  memory_utilization: number;
  disk_utilization: number;
  node_caption: string;
};

type GroupType = {
  group_caption: string;
  group_status_description: StatusKey;
  nodes: string[];
};

type NodeType = {
  node_caption: string;
  node_status_description: StatusKey;
  cpu_utilization: number;
  disk_utilization: number;
  memory_utilization: number;
};
type MetricsData = {
  cpu_utilization: number;
  disk_utilization: number;
  memory_utilization: number;
  datetime: string;
  node_caption: string;
};

type MetricsType = {
  interface_caption: string;
  interface_status_description: StatusKey;
  admin_email: string;
  admin_firstname: string;
  admin_lastname: string;
  application_caption: string;
  chart_data: ChartData;
};

export type ChartData = {
  cpu_utilization: Array<{
    datetime: string;
    value: number;
  }>;

  disk_utilization: Array<{
    datetime: string;
    value: number;
  }>;

  memory_utilization: Array<{
    datetime: string;
    value: number;
  }>;
};

function App() {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [groupsData, setGroupsData] = useState<GroupsData[]>([]);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [metrics, setMetrics] = useState<MetricsType[]>([]);

  const addAdditionalFieldsFilterGroups = () => {
    const updatedMetrics = metrics
      .map((metric) => {
        const node = groupsData.find(
          (group) => group.node_caption === metric.node_caption,
        );

        return {
          ...metric,
          interface_caption: node?.interface_caption,
          interface_status_description: node?.interface_status_description,
          admin_email: node?.admin_email,
          admin_firstname: node?.admin_firstname,
          admin_lastname: node?.admin_lastname,
          application_caption: node?.application_caption,
        };
      })
      .filter((item) => {
        if (activeGroup) {
          const group = groups.find(
            (elem) => elem.group_caption === activeGroup,
          );
          return group?.nodes.includes(item?.node_caption);
        }
        return true;
      });
    setMetrics(updatedMetrics);

    const updatedNodes = nodes
      .map((node) => ({
        ...node,
        node_status_description: groupsData.find(
          (group) => group.node_caption === node.node_caption,
        )?.node_status_description,
      }))
      .filter((item) => {
        if (activeGroup) {
          const group = groups.find(
            (elem) => elem.group_caption === activeGroup,
          );
          return group?.nodes.includes(item?.node_caption);
        }
        return true;
      });

    setNodes(updatedNodes);
  };

  const addAdditionalFieldsFilterNodes = () => {
    const updatedMetrics = metrics
      .map((metric) => {
        const node = groupsData.find(
          (group) => group.node_caption === metric.node_caption,
        );

        return {
          ...metric,
          interface_caption: node?.interface_caption,
          interface_status_description: node?.interface_status_description,
          admin_email: node?.admin_email,
          admin_firstname: node?.admin_firstname,
          admin_lastname: node?.admin_lastname,
          application_caption: node?.application_caption,
        };
      })
      .filter((item) => {
        if (activeNode) {
          if (item.node_caption === activeNode) {
            return true;
          }
          return false;
        }
        return true;
      });

    setMetrics(updatedMetrics);

    const updatedGroups = groups.filter((group) => {
      if (activeNode) {
        if (group.nodes.includes(activeNode)) {
          return true;
        }
        return false;
      }
      return true;
    });
    setGroups(updatedGroups);
  };

  useEffect(() => {
    const fetchData = () => {
      fetchGroups();
      fetchMetrics();

      addAdditionalFieldsFilterGroups();
      if (activeNode) {
        addAdditionalFieldsFilterNodes();
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (groupsData.length > 0 || metrics.length > 0) {
      addAdditionalFieldsFilterGroups();
    }
  }, [groupsData]);

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://127.0.0.1:23456/api/groups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const groupsData = await response.json();
      setGroupsData(groupsData);
      setGroups(getGroups(groupsData));

      return groupsData;
    } catch (error) {
      console.error('Ошибка запроса', error);
      throw error;
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://127.0.0.1:23456/api/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const metricsData = await response.json();
      setMetricsData(metricsData);
      setNodes(getNodes(metricsData));
      setMetrics(getMetrics(metricsData));
      return metricsData;
    } catch (error) {
      console.error('Ошибка запроса', error);
      throw error;
    }
  };

  const getGroups = (data: GroupsData[]) => {
    return data.reduce((acc, item) => {
      const currentElem = acc.find(
        (elem) => elem.group_caption === item.group_caption,
      );
      if (currentElem) {
        currentElem.nodes.push(item.node_caption);
        if (
          StatusValues[currentElem.group_status_description] <
          StatusValues[item.node_status_description]
        ) {
          currentElem['group_status_description'] =
            item.node_status_description;
        }
      } else {
        acc.push({
          group_caption: item.group_caption,
          group_status_description: item.node_status_description,
          nodes: [item.node_caption],
        });
      }

      return acc;
    }, []);
  };

  const getNodes = (data: NodeData[]) => {
    return data.reduce((acc, item) => {
      const currentElem = acc.find(
        (elem) => elem.node_caption === item.node_caption,
      );
      if (currentElem) {
        if (
          new Date(currentElem.datetime).getTime() <
          new Date(item.datetime).getTime()
        ) {
          currentElem.cpu_utilization = item.cpu_utilization;
          currentElem.memory_utilization = item.memory_utilization;
          currentElem.disk_utilization = item.disk_utilization;
        }
      } else {
        acc.push({
          node_caption: item.node_caption,
          cpu_utilization: item.cpu_utilization,
          disk_utilization: item.disk_utilization,
          memory_utilization: item.memory_utilization,
        });
      }

      return acc;
    }, []);
  };

  const getMetrics = (data: NodeData[]) => {
    return data.reduce((acc: MetricsType, item) => {
      const currentElem = acc.find(
        (elem) => elem.node_caption === item.node_caption,
      );
      if (currentElem) {
        currentElem.chart_data.cpu_utilization.push({
          value: item.cpu_utilization,
          datetime: item.datetime,
        });
        currentElem.chart_data.disk_utilization.push({
          value: item.disk_utilization,
          datetime: item.datetime,
        });
        currentElem.chart_data.memory_utilization.push({
          value: item.memory_utilization,
          datetime: item.datetime,
        });
      } else {
        acc.push({
          chart_data: {
            cpu_utilization: [
              {
                value: item.cpu_utilization,
                datetime: item.datetime,
              },
            ],
            disk_utilization: [
              {
                value: item.disk_utilization,
                datetime: item.datetime,
              },
            ],
            memory_utilization: [
              {
                value: item.memory_utilization,
                datetime: item.datetime,
              },
            ],
          },
          node_caption: item.node_caption,
        });
      }

      return acc;
    }, []);
  };

  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    addAdditionalFieldsFilterGroups();
  }, [activeGroup]);

  const onGroupClick = (caption: string) => {
    setNodes(getNodes(metricsData));
    setMetrics(getMetrics(metricsData));

    if (caption === activeGroup) {
      setActiveGroup(null);
    } else {
      setActiveGroup(caption);
    }
  };

  useEffect(() => {
    addAdditionalFieldsFilterNodes();
  }, [activeNode]);

  const onNodeClick = (caption: string) => {
    setGroups(getGroups(groupsData));
    setMetrics(getMetrics(metricsData));

    if (caption === activeNode) {
      setActiveNode(null);
    } else {
      setActiveNode(caption);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.wrapper}>
        <section className={styles.groups}>
          <h2 className={styles.sectionTitle}>Группы</h2>
          {groups.map((group) => (
            <GroupItem
              key={group.group_caption}
              status={
                <Status statusDescription={group.group_status_description} />
              }
              groupCaption={group.group_caption}
              isActive={activeGroup === group.group_caption}
              onClick={() => onGroupClick(group.group_caption)}
            />
          ))}
        </section>
        <section className={styles.nodes}>
          <h2 className={styles.sectionTitle}>Ноды</h2>
          {nodes.map((node) => (
            <NodeItem
              key={node.node_caption}
              status={
                <Status statusDescription={node.node_status_description} />
              }
              nodeCaption={node.node_caption}
              cpuUtilization={node.cpu_utilization}
              memoryUtilization={node.memory_utilization}
              diskUtilization={node.disk_utilization}
              isActive={activeNode === node.node_caption}
              onClick={() => onNodeClick(node.node_caption)}
            />
          ))}
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Метрики</h2>
          {metrics.map((metric, index) => (
            <Metrics
              key={index}
              chartData={metric.chart_data}
              interfaceCaption={metric.interface_caption}
              status={
                <Status
                  statusDescription={metric.interface_status_description}
                />
              }
              adminEmail={metric.admin_email}
              adminFirstname={metric.admin_firstname}
              adminLastname={metric.admin_lastname}
              applicationCaption={metric.application_caption}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;
