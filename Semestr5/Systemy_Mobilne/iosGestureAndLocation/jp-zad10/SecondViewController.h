#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SecondViewController : UIViewController <CLLocationManagerDelegate>
{
    CLLocationManager *locationManager;
    CLGeocoder *geocoder;
    CLPlacemark *placemark;
}

@property (nonatomic, weak) IBOutlet UILabel *latitudeLabel;
@property (nonatomic, weak) IBOutlet UILabel *addressLabel;
@property (nonatomic, weak) IBOutlet UILabel *longtitudeLabel;

@property (nonatomic, weak) IBOutlet UITextField *latitudeText;
@property (nonatomic, weak) IBOutlet UITextView *addressText;
@property (nonatomic, weak) IBOutlet UITextField *longtitudeText;

-(IBAction)GetCurrentLocation:(id)sender;

@end

NS_ASSUME_NONNULL_END
