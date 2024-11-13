#import "SecondViewController.h"

@interface SecondViewController ()

@end

@implementation SecondViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    locationManager = [[CLLocationManager alloc] init];
    geocoder = [[CLGeocoder alloc] init];
    // Do any additional setup after loading the view.
}

- (void)GetCurrentLocation:(id)sender{
    locationManager.delegate = self;
    if([locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]){
        [locationManager requestWhenInUseAuthorization];
    }
    locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    [locationManager startUpdatingLocation];
}
 
-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error{
    NSLog(@"didFailWithError: %@", error);
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Error" message:@"Failed to get your location" preferredStyle:UIAlertControllerStyleAlert];
 
    UIAlertAction *okButton = [UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){[self.view setBackgroundColor:[UIColor blueColor]];}];
    [alertController addAction:okButton];
    [self presentViewController:alertController animated:YES completion:nil];
}
 
-(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(nonnull NSArray<CLLocation *> *)locations{
    NSLog(@"didUpdateLocations");
 
    CLLocation *currentLocation = [locations lastObject];
    if(currentLocation != nil){
        _longtitudeText.text = [NSString stringWithFormat:@"%.8f", currentLocation.coordinate.longitude];
        _latitudeText.text = [NSString stringWithFormat:@"%.8f", currentLocation.coordinate.latitude];
    }
 
    [geocoder reverseGeocodeLocation:currentLocation completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
        if(error == nil && [placemarks count] > 0){
            self->placemark = [placemarks lastObject];
            self->_addressText.text = [NSString stringWithFormat:@"%@%@\n%@%@\n%@\n%@", self->placemark.subThoroughfare, self->placemark.thoroughfare, self->placemark.postalCode, self->placemark.locality, self->placemark.administrativeArea, self->placemark.country];
        } else{
            NSLog(@"%@", error.debugDescription);
        }
    }];
}

@end
