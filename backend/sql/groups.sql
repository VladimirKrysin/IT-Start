SELECT
  
    groups.caption AS group_caption,
    
    nodes.caption AS node_caption,

    node_status.color AS node_status_color,
    node_status.description AS node_status_description,
    
    interfaces.caption AS interface_caption,
    
    interface_status.color AS interface_status_color,
    interface_status.description AS interface_status_description,
    
    applications.caption AS application_caption,
    users.firstname AS admin_firstname ,
	users.lastname AS admin_lastname,
	users.email AS admin_email
    
FROM
    groups
    
LEFT JOIN
    groups_nodes ON groups.id = groups_nodes.group_id
LEFT JOIN
    nodes ON groups_nodes.node_id = nodes.id
    
LEFT JOIN
    statuses AS node_status ON nodes.status = node_status.id
    
LEFT JOIN
    interfaces ON nodes.interface = interfaces.id
    
LEFT JOIN
    statuses AS interface_status ON interfaces.status = interface_status.id
    
LEFT JOIN
    nodes_applications ON nodes.id = nodes_applications.node_id
LEFT JOIN
    applications ON nodes_applications.application_id = applications.id
    
LEFT JOIN
    users ON nodes.admin = users.id
    