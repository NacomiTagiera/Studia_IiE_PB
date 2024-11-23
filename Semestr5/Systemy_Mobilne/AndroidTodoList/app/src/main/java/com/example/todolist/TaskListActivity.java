package com.example.todolist;

import androidx.fragment.app.Fragment;

public class TaskListActivity extends SingleFragmentActivity {
  @Override
  protected Fragment createFragment() {
    return new TaskListFragment();
  }
}
