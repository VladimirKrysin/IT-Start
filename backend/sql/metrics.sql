SELECT
  metrics.id AS metrics_id,
  metrics.datetime,
  metrics.cpu_utilization,
  metrics.memory_utilization,
  metrics.disk_utilization,
  nodes.id AS node_id,
  nodes.caption AS node_caption
FROM metrics
JOIN nodes ON metrics.node_id = nodes.id;

