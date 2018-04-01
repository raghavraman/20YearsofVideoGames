SELECT * from task_entries
join tasks on tasks.id = task_entries.task_id;

Select * from tasks
join projects on projects.id = tasks.project_id;

UPDATE task_entries set start_time=CURTIME(); where id=taskentryid;


task_entries.id as entry_id,
task_entries.task_id as task_id,
task_entries.duration,
task_entries.note,
task_entries.start_time,
tasks.project_id,
tasks.user_id,
tasks.task_name,
tasks.id as task_id

SELECT task_entries.id as entry_id,
task_entries.task_id as task_id,
task_entries.duration,
task_entries.note,
task_entries.start_time,
tasks.project_id,
tasks.user_id,
tasks.task_name,
tasks.id as task_id from task_entries
join tasks on tasks.id = task_entries.task_id;