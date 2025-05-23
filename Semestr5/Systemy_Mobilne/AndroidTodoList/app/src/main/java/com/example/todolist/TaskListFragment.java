package com.example.todolist;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class TaskListFragment extends Fragment {

  public static final String KEY_EXTRA_TASK_ID = "tasklistfragment.taskId";
  RecyclerView recyclerView;
  TaskAdapter adapter;

  @Nullable
  @Override
  public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fragment_task_list, container, false);
    recyclerView = view.findViewById(R.id.task_recycler_view);
    recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
    return view;
  }

  @SuppressLint("NotifyDataSetChanged")
  private void updateView(){
    TaskStorage taskStorage = TaskStorage.getInstance();
    List<Task> tasks = taskStorage.getTasks();
    if (adapter == null){
      adapter = new TaskAdapter(tasks);
      recyclerView.setAdapter(adapter);
    } else {
      adapter.notifyDataSetChanged();
    }
  }

  @Override
  public void onResume() {
    super.onResume();
    updateView();
  }

  private class TaskHolder extends RecyclerView.ViewHolder implements View.OnClickListener{

    private TextView nameTextView, dateTextView;
    private Task task;

    public TaskHolder(LayoutInflater inflater, ViewGroup parent){
      super(inflater.inflate(R.layout.list_item_task, parent, false));
      itemView.setOnClickListener(this);
      nameTextView = itemView.findViewById(R.id.task_item_name);
      dateTextView = itemView.findViewById(R.id.task_item_date);
    }

    public void bind(Task task){
      this.task =  task;
      nameTextView.setText(task.getName());
      dateTextView.setText(task.getDate().toString());
    }

    @Override
    public void onClick(View v) {
      Intent intent = new Intent(getActivity(), MainActivity.class);
      intent.putExtra(KEY_EXTRA_TASK_ID, task.getId());
      startActivity(intent);
    }
  }

  private class TaskAdapter extends RecyclerView.Adapter<TaskHolder>{
    private final List<Task> tasks;
    public TaskAdapter(List<Task> tasks){
      this.tasks = tasks;
    }

    @NonNull
    @Override
    public TaskHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
      LayoutInflater layoutInflater = LayoutInflater.from(getActivity());
      return new TaskHolder(layoutInflater, parent);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskHolder holder, int position) {
      Task task = tasks.get(position);
      holder.bind(task);
    }

    @Override
    public int getItemCount() {
      return tasks.size();
    }
  }
}