using CommunityToolkit.Mvvm.ComponentModel;

namespace WpfRestaurant.ViewModels
{
    public abstract class BaseViewModel : ObservableValidator
    {
        private bool _isBusy;
        private string _title = string.Empty;

        public bool IsBusy
        {
            get => _isBusy;
            set => SetProperty(ref _isBusy, value);
        }

        public string Title
        {
            get => _title;
            set => SetProperty(ref _title, value);
        }
    }
} 