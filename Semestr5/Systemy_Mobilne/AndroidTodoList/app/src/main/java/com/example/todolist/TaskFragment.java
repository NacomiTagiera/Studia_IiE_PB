package com.example.todolist;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import java.util.UUID;

public class TaskFragment extends Fragment {
  EditText nameField;
  Button dateButton;
  CheckBox doneCheckBox;
  View view;
  public static final String ARG_TASK_ID = "taskId";
  private Task task;

  @Override
  public void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    UUID taskId = (UUID) getArguments().getSerializable(ARG_TASK_ID);
    task = TaskStorage.getInstance().getTask(taskId);
  }

  public static TaskFragment newInstance(UUID taskId) {
    Bundle bundle = new Bundle();
    bundle.putSerializable(ARG_TASK_ID, taskId);
    TaskFragment taskFragment = new TaskFragment();
    taskFragment.setArguments(bundle);
    return taskFragment;
  }

  @Nullable
  @Override
  public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
    this.view = inflater.inflate(R.layout.fragment_task, container, false);

    nameField = view.findViewById(R.id.task_name);
    nameField.setText(task.getName());

    dateButton = view.findViewById(R.id.task_date);
    doneCheckBox = view.findViewById(R.id.task_done);

    nameField.addTextChangedListener(new TextWatcher(){
      @Override
      public void beforeTextChanged(CharSequence s, int start, int before, int count){

      }
      @Override
      public void onTextChanged(CharSequence s, int start, int before, int count){
        task.setName(s.toString());
      }
      @Override
      public void afterTextChanged(Editable s){

      }
    });

    dateButton.setText(task.getDate().toString());
    dateButton.setEnabled(false);
    doneCheckBox.setChecked(task.isDone());
    doneCheckBox.setOnCheckedChangeListener((buttonView, isChecked) -> task.setDone(isChecked));

    return view;
  }


}