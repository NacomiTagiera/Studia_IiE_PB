package com.example.todolist;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TaskStorage {
  private static final TaskStorage taskStorage = new TaskStorage();
  private final List<Task> tasks;

  public static TaskStorage getInstance() {
    return taskStorage;
  }

  private TaskStorage() {
    tasks = new ArrayList<>();
    for(int i=1;i<=150;i++){
      Task task = new Task();
      task.setName("Pilne zadanie numer: " + i);
      task.setDone(i%3 == 0);
      tasks.add(task);
    }
  }

  public Task getTask(UUID taskId) {
    for (Task task : tasks) {
      if (task.getId().equals(taskId))
        return task;
    }

    return null;
  }

  public List<Task> getTasks() {
    return tasks;
  }
}
