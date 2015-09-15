//
//  HockeyAppPlugin.m
//

#import <HockeySDK/HockeySDK.h>

#import "HockeyAppPlugin.h"

@implementation HockeyAppPlugin

#pragma mark Initialization

NSString * hockeyAppKey = @"";

- (void)pluginInitialize
{
    [self observeLifeCycle];
    NSLog(@"HockeyApp Plugin initialized");
}

- (void) observeLifeCycle
{
    NSNotificationCenter* listener = [NSNotificationCenter defaultCenter];

    if (&UIApplicationWillEnterForegroundNotification) {

        [listener addObserver:self
                     selector:@selector(onResume)
                         name:UIApplicationWillEnterForegroundNotification
                       object:nil];
    }
}

- (void) onResume 
{
	NSLog(@"holy fuck balls: onResume");

    BITUpdateManager * mgr = [[BITHockeyManager sharedHockeyManager] updateManager];
	[mgr checkForUpdate];
}

- (void) configure:(CDVInvokedUrlCommand *)command
{
	NSLog(@"holy fuck balls: configure");

	hockeyAppKey = [command.arguments objectAtIndex:0];

    if (hockeyAppKey!=nil && [hockeyAppKey isEqualToString:@""]==NO && [hockeyAppKey rangeOfString:@"HOCKEY_APP_KEY"].location == NSNotFound ){

        [[BITHockeyManager sharedHockeyManager] configureWithBetaIdentifier:hockeyAppKey
                                                             liveIdentifier:hockeyAppKey
                                                                   delegate:self];

        [[BITHockeyManager sharedHockeyManager] startManager];
        [[BITHockeyManager sharedHockeyManager].authenticator authenticateInstallation];
    }
}
@end
