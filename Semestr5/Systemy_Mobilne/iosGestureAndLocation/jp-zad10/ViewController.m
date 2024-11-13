#import "ViewController.h"
#import "SecondViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self becomeFirstResponder];
}

-(void)motionEnded:(UIEventSubtype)motion withEvent:(UIEvent *)event {
    if(motion == UIEventSubtypeMotionShake) {
        [self showShakeDetectedAlert];
    }
}

-(BOOL) canBecomeFirstResponder{
    return YES;
}

-(IBAction)showShakeDetectedAlert {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Shake gesture detected!" message:@"Do you want to change the background color?" preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction *yesButton = [UIAlertAction actionWithTitle:@"Yes" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){
        self.view.backgroundColor = [UIColor colorWithHue:drand48() saturation:1.0 brightness:1.0 alpha:1.0];
        self.gestureLabel.text = @"Shake detected";
    }];
    
    UIAlertAction *noButton = [UIAlertAction actionWithTitle:@"No" style:UIAlertActionStyleDefault handler:^(UIAlertAction *action){
        self.gestureLabel.text = @"Shake detected";
    }];
    
    [alertController addAction:yesButton];
    [alertController addAction:noButton];
    [self presentViewController:alertController animated:YES completion:nil];
}

-(IBAction)tapGesture:(UITapGestureRecognizer *)sender {
    _gestureLabel.text = @"Tap detected!";
}

-(IBAction)pinchGesture: (UIPinchGestureRecognizer *) sender {
    _gestureLabel.text = @"Pinch detected!";
}

-(IBAction)swipeGesture: (UISwipeGestureRecognizer *) sender {
    [self performSegueWithIdentifier:@"showSecond" sender:nil];
    _gestureLabel.text = @"Swipe detected!";
}

-(IBAction)longPressGesture: (UILongPressGestureRecognizer *) sender {
    _gestureLabel.text = @"LongPress detected!";
}

@end
