'use strict';
angular.module('waid.idm.controllers', ['waid.core']).controller('WAIDIDMTermsAndConditionsCtrl', function ($scope, $rootScope, waidService, $interpolate) {
  waidService.documentGet('terms-and-conditions').then(function (data) {
    var text = $interpolate(data.text)($rootScope);
    $scope.document = text;
  });
}).controller('WAIDIDMProfileNavbarCtrl', function ($scope, $rootScope, waidService) {
  $scope.goToFieldSet = function (fieldSet) {
    $rootScope.$broadcast('waid.idm.action.goToFieldSet', fieldSet);
  };

  // TODO : Duplicate Initialize user profile an viewset models
  waidService.applicationProfileDefinitionGet().then(function(data) {
    var fieldSet = data.fieldSets.profile;

    // Create new Ordered fieldset for objects properties 
    var orderedGroup = {};
    for (var i = 0; fieldSet.order.length > i; i++) {
      var groupName = fieldSet.order[i];
      orderedGroup[groupName] = fieldSet.groups[groupName];
    }
    fieldSet.groups = orderedGroup;

    $scope.fieldSet = fieldSet;
    $scope.fieldDefinitions = data.fieldDefinitions;
  });



}).controller('WAIDIDMProfileCtrl', function ($scope, $rootScope, waidCore, waidService, $filter, $timeout, $q) {
  $scope.model = {};

  // Initialize user profile an viewset models
  waidService.applicationProfileDefinitionGet().then(function(data) {
    var fieldSet = data.fieldSets.profile;

    // Create new Ordered fieldset for objects properties 
    var orderedGroup = {};
    for (var i = 0; fieldSet.order.length > i; i++) {
      var groupName = fieldSet.order[i];
      orderedGroup[groupName] = fieldSet.groups[groupName];
    }
    fieldSet.groups = orderedGroup;

    $scope.fieldSet = fieldSet;
    $scope.fieldDefinitions = data.fieldDefinitions;
   
    // Overwrite fieldDefinition parameters if set in fieldSet
    for(var fieldName in $scope.fieldDefinitions){
      if(typeof($scope.fieldSet.fieldDefinitions[fieldName]) != 'undefined') {
        for(var fieldDefinitionProperty in $scope.fieldSet.fieldDefinitions[fieldName]){
          $scope.fieldDefinitions[fieldName][fieldDefinitionProperty] = $scope.fieldSet.fieldDefinitions[fieldName][fieldDefinitionProperty]
        }
      } 
    }
    var groupedFieldDefinitions = {};
    for(var group in $scope.fieldSet.groups){
      var fieldDefinitions = {};
      if (typeof($scope.fieldSet.groups[group]['fieldDefinitions']) != 'undefined') {
        for (var i = 0; $scope.fieldSet.groups[group]['fieldDefinitions'].length > i; i++) {
          var fieldSetFieldDefinitionName = $scope.fieldSet.groups[group]['fieldDefinitions'][i];
          fieldDefinitions[fieldSetFieldDefinitionName] = $scope.fieldDefinitions[fieldSetFieldDefinitionName];
        }
      }
      groupedFieldDefinitions[group] = fieldDefinitions;
    }
    $scope.groupedFieldDefinitions = groupedFieldDefinitions;    
  });

  $scope.goToFieldSet = function (fieldSet) {
    $rootScope.$broadcast('waid.idm.action.goToFieldSet', fieldSet);
  };

  // Goto fieldset event
  $rootScope.$on('waid.idm.action.goToFieldSet', function (event, fieldSet) {
    $scope.currentFieldSet = fieldSet;
    $scope.errors = [];
  });

  $scope.waid = waidCore;
  // Set profile definition
  //$scope.profileDefinition = waidCore.config.idm.profileDefinition;

  // Telephone numbers objects
  $scope.telephoneNumbers = [];
  
  // Addres objects
  $scope.addresses = [];

  // Emails fields
  $scope.inactiveEmails = [];
  $scope.activeEmails = [];
  $scope.email = { 'add': '' };
  // some weird stuff with model?
  // Main errors array
  $scope.errors = [];
  // Flag if uploading of avatar is running.
  $scope.isUploading = false;
  // Holds field names that are changed.
  $scope.changedFields = [];
  $scope.showFieldSet = function (fieldSet) {
    return fieldSet == $scope.currentFieldSet ? true : false;
  };
  $scope.getActiveFieldSetMenuClass = function (fieldSet) {
    return fieldSet == $scope.currentFieldSet ? 'active' : '';
  };
  $scope.getAllFieldDefinitions = function () {
    var fieldDefinitions = [];
    for(var fieldName in $scope.fieldDefinitions){
      fieldDefinitions.push($scope.fieldDefinitions[fieldName]);
    }
    return fieldDefinitions;
  };
  // $scope.getFieldSetGroups = function() {
  //   var fieldSetGroups = [];
  //   for(var group in $scope.fieldSet.groups){
  //     fieldSetGroups.push($scope.fieldSet.groups[group]);
  //   }
  //   return fieldSetGroups;
  // }

  $scope.dateOptions = {
    dateDisabled: false,
    maxDate: new Date(),
    minDate: new Date(1940, 1, 1),
    startingDay: 1,
    datepickerMode: 'year'
  };
  $scope.popup = { opened: false };
  $scope.open = function () {
    $scope.popup.opened = true;
  };
  $scope.fieldChange = function (fieldName) {
    if ($scope.changedFields.indexOf(fieldName) == -1) {
      $scope.changedFields.push(fieldName);
    }
  };
  $scope.updateProfileInfo = function () {
    var defer = $q.defer();
    waidService.userProfileGet().then(function (data) {
      var data = $scope.formatDataFromApi(data);
      $scope.errors = [];
      for (var key in data) {
        $scope.model[key] = data[key];
      }
      waidCore.user = data;
      defer.resolve(data);
    }, function (data) {
      $scope.errors = data;
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.uploadFile = function (files) {
    if (typeof files != 'undefined' && files.length > 0) {
      $scope.isUploading = true;
      var fd = new FormData();
      fd.append('file', files[0]);
      waidService.userAvatarPut(fd).then(function (data) {
        angular.extend(waidCore.user, data);
        $timeout(function () {
          $scope.isUploading = false;
        }, 1000);
      });
    }
  };

  $scope.formatDataFromApi = function (data) {
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    for (var i = 0; fieldDefinitions.length > i; i++) {
      var fieldDefinition = fieldDefinitions[i];
      // Format date
      if (fieldDefinition.type == 'date') {
        if (typeof data[fieldDefinition.name] != 'undefined' && data[fieldDefinition.name] && !(data[fieldDefinition.name] instanceof Date)) {
          var dateParts = data[fieldDefinition.name].split('-');
          data[fieldDefinition.name] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          continue;
        }
      }
    }
    return data;
  };
  $scope.formatDataToApi = function (data) {
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    var fieldValues = {};
    for (var i = 0; fieldDefinitions.length > i; i++) {
      var fieldDefinition = fieldDefinitions[i];
      // Format date
      if (fieldDefinition.type == 'date') {
        if (typeof data[fieldDefinition.name] != 'undefined' && data[fieldDefinition.name] instanceof Date) {
          fieldValues[fieldDefinition.name] = $filter('date')(data[fieldDefinition.name], 'yyyy-MM-dd');
          continue;
        }
        if (typeof data[fieldDefinition.name] != 'undefined' && !(data[fieldDefinition.name] instanceof Date)) {
          fieldValues[fieldDefinition.name] = $filter('date')(new Date(data[fieldDefinition.name]), 'yyyy-MM-dd');
          continue;
        }
      }
      fieldValues[fieldDefinition.name] = data[fieldDefinition.name];
    }
    return fieldValues;
  };
  $scope.saveMetadata = function (defaultMetadataPostData) {
    var defer = $q.defer();
    waidService.userApplicationMetadataPost(defaultMetadataPostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.saveDefault = function (defaultProfilePostData) {
    var defer = $q.defer();
    waidService.userProfilePatch(defaultProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.saveUsername = function (usernameProfilePostData) {
    var defer = $q.defer();
    waidService.userUsernamePut(usernameProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.savePassword = function (passwordProfilePostData) {
    var defer = $q.defer();
    waidService.userPasswordPut(passwordProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.save = function (forceProfileUpdate) {
    $scope.errors = [];
    var dataPrepared = $scope.formatDataToApi($scope.model);
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    //var profilePostData = angular.copy($scope.model);
    //console.log(profilePostData);
    var collectMetadata = false;
    var defaultProfilePostData = {};
    var passwordProfilePostData = {};
    var usernameProfilePostData = {};
    var metadataProfilePostData = {};
    for (var i in fieldDefinitions) {
      var fieldDefinition = fieldDefinitions[i];
      var storageType = (typeof fieldDefinition.storageType != 'undefined') ? fieldDefinition.storageType : 'default';

      if ($scope.changedFields.indexOf(fieldDefinition.name) != -1) {
        if (storageType == 'username') {
          usernameProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
          continue;
        }
        if (storageType == 'password') {
          passwordProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
          continue;
        }
        // Skip storage
        if (storageType == 'none') {
          continue;
        }

        if (storageType == 'default') {
          defaultProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
        }

        if (storageType == 'metadata') {
          collectMetadata = true;
        }
      }
      if (storageType == 'metadata') {
        // Store all metadata fields becouse it must post all values
        metadataProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
      }
    }
    var promises = [];
    // Password store call
    if (Object.keys(passwordProfilePostData).length) {
      promises.push($scope.savePassword(passwordProfilePostData));
    }
    // Username store call
    if (Object.keys(usernameProfilePostData).length) {
      promises.push($scope.saveUsername(usernameProfilePostData));
    }
    // Default store  call
    if (Object.keys(defaultProfilePostData).length) {
      promises.push($scope.saveDefault(defaultProfilePostData));
    }
    // Metadata store call
    if (Object.keys(metadataProfilePostData).length && collectMetadata) {
      promises.push($scope.saveMetadata(metadataProfilePostData));
    }

    // Telephone store call
    if ($scope.changedFields.indexOf('telephone_numbers') != -1) {
      promises.push($scope.saveTelephoneList());
    }

    // Addresses store call
    if ($scope.changedFields.indexOf('addresses') != -1) {
      promises.push($scope.saveAddressList());
    }

    $q.all(promises).then(function () {
      $scope.errors = [];
      $rootScope.$broadcast('waid.idm.userProfile.save.ok');
      $scope.currentFieldSet = 'overview';
      if (forceProfileUpdate) {
        $scope.updateProfileInfo();
      }
      // Reset changed fields
      $scope.changedFields = [];
    }, function (errors) {
      // pass
    });
  };
  $scope.initEmails = function (data) {
    $scope.emails = data;
    $scope.inactiveEmails = [];
    $scope.activeEmails = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].is_verified == 1) {
          $scope.activeEmails.push(data[i]);
        } else {
          $scope.inactiveEmails.push(data[i]);
        }
      }
    }
  };
  $scope.addEmailEnter = function (keyEvent) {
    if (keyEvent.which === 13) {
      $scope.addEmail($scope.email.add);
      keyEvent.preventDefault();
    }
  };
  $scope.deleteEmail = function (id) {
    waidService.userEmailDelete(id).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.addEmail = function () {
    var data = { 'email': $scope.email.add };

    waidService.userEmailPost(data).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
      $scope.email.add = '';
      $rootScope.$broadcast('waid.idm.action.addEmail.ok', data);
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.loadEmailList = function () {
    waidService.userEmailListGet().then(function (data) {
      $scope.initEmails(data.results);
    });
  };

  $scope.deleteTelephone = function(key) {
    $scope.telephoneNumbers.splice(key, 1)
  };
  $scope.changeTelephoneValue = function(fieldName, key) {
    $scope.fieldChange(fieldName);
    $scope.checkNewTelephoneNumer();
  };
  $scope.checkTelephoneChanged = function(originalObject, newObject) {
    if(originalObject.number != newObject.number) {
      return true;
    }
    return false;
  }

  $scope.checkNewTelephoneNumer = function()
  {
    var lastItem = $scope.telephoneNumbers.slice(-1).pop();
    if (typeof lastItem == 'undefined' || $scope.checkTelephoneAnyFieldFilled(lastItem)) {
      $scope.addNewTelephoneItem();
    }
  };
  $scope.addNewTelephoneItem = function() {
    $scope.telephoneNumbers.push({
      'id':'new',
      'number':'',
      'action': '',
      'errors':[]
    })
  };
  
  // Checks if any field is filled in..
  $scope.checkTelephoneAnyFieldFilled = function(telephone) {
    if (telephone.number != '') {
      return true;
    }
    return false;
  }

  $scope.saveTelephoneList = function() {
    for (var i=0; i < $scope.telephoneNumbers.length; i++) {
      $scope.telephoneNumbers[i].action = '';
      $scope.telephoneNumbers[i].errors = [];
      if (!$scope.checkTelephoneAnyFieldFilled($scope.telephoneNumbers[i])) {
        continue;
      }
      // Add new
      if ($scope.telephoneNumbers[i].id == 'new') {
        $scope.telephoneNumbers[i].action = 'new';
        continue;
      };

      // Changed values
      for (var a=0; a < $scope.originalTelephoneNumbers.length; a++) {
        // If original id match new id
        if ($scope.originalTelephoneNumbers[a].id == $scope.telephoneNumbers[i].id) {
          // If changed
          if ($scope.checkTelephoneChanged($scope.originalTelephoneNumbers[a], $scope.telephoneNumbers[i])) {
            $scope.telephoneNumbers[i].action = 'change';
          }
        }
      }
    }

    // Deleted telephones
    var deleteTelephones = angular.copy($scope.originalTelephoneNumbers);

    for (var a=0; a < deleteTelephones.length; a++) {
      for (var i=0; i < $scope.telephoneNumbers.length; i++) {
        if (typeof deleteTelephones[a] == 'undefined' || typeof deleteTelephones[a].id == 'undefined') {
          deleteTelephones.splice(a, 1);
          continue;
        }
        if (deleteTelephones[a].id == $scope.telephoneNumbers[i].id) {
          deleteTelephones.splice(a, 1);
        }
      }
    }

    var changeTelephone = function(i){
      var defer = $q.defer();
      waidService.userTelephonePut($scope.telephoneNumbers[i].id, $scope.telephoneNumbers[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.telephoneNumbers[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var newTelephone = function(i){
      var defer = $q.defer();
      waidService.userTelephonePost($scope.telephoneNumbers[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.telephoneNumbers[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var deleteTelephone = function(i){
      var defer = $q.defer();
      waidService.userTelephoneDelete(deleteTelephones[i].id).then(function(data){
        defer.resolve(data);
      }, function(data) {
        $scope.telephoneNumbers[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    };
    var promises = new Array();
    for (var i=0; i < $scope.telephoneNumbers.length; i++) {
      if ($scope.telephoneNumbers[i].action == 'change') {
        promises.push(changeTelephone(i));
      }
      if ($scope.telephoneNumbers[i].action == 'new') {
        promises.push(newTelephone(i));
      }
    }
    
    for (var i=0; i < deleteTelephones.length; i++) {
      // Might have an empty telephone
      promises.push(deleteTelephone(i));

    }

    var defer = $q.defer();
    $q.all(promises).then(function () {
      $scope.loadTelephoneList();
      defer.resolve();
    }, function (errors) {
      defer.reject(errors);
    });
    return defer.promise;
  }

  $scope.saveAddressList = function() {
    for (var i=0; i < $scope.addresses.length; i++) {
      $scope.addresses[i].action = '';
      $scope.addresses[i].errors = [];
      if (!$scope.checkAddressAnyFieldFilled($scope.addresses[i])) {
        continue;
      }
      // Add new
      if ($scope.addresses[i].id == 'new') {
        $scope.addresses[i].action = 'new';
        continue;
      };

      // Changed values
      for (var a=0; a < $scope.originalAddresses.length; a++) {
        // If original id match new id
        if ($scope.originalAddresses[a].id == $scope.addresses[i].id) {
          // If changed
          if ($scope.checkAddressChanged($scope.originalAddresses[a], $scope.addresses[i])) {
            $scope.addresses[i].action = 'change';
          }
        }
      }
    }

    // Deleted addresses
    var deleteAddresss = angular.copy($scope.originalAddresses);

    for (var a=0; a < deleteAddresss.length; a++) {
      for (var i=0; i < $scope.addresses.length; i++) {
        if (typeof deleteAddresss[a] == 'undefined' || typeof deleteAddresss[a].id == 'undefined') {
          deleteAddresss.splice(a, 1);
          continue;
        }
        if (deleteAddresss[a].id == $scope.addresses[i].id) {
          deleteAddresss.splice(a, 1);
        }
      }
    }

    var changeAddress = function(i){
      var defer = $q.defer();
      waidService.userAddressPut($scope.addresses[i].id, $scope.addresses[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.addresses[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var newAddress = function(i){
      var defer = $q.defer();
      waidService.userAddressPost($scope.addresses[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.addresses[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var deleteAddress = function(i){
      var defer = $q.defer();
      waidService.userAddressDelete(deleteAddresss[i].id).then(function(data){
        defer.resolve(data);
      }, function(data) {
        $scope.addresses[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    };
    var promises = new Array();
    for (var i=0; i < $scope.addresses.length; i++) {
      if ($scope.addresses[i].action == 'change') {
        promises.push(changeAddress(i));
      }
      if ($scope.addresses[i].action == 'new') {
        promises.push(newAddress(i));
      }
    }
    
    for (var i=0; i < deleteAddresss.length; i++) {
      // Might have an empty telephone
      promises.push(deleteAddress(i));

    }

    var defer = $q.defer();
    $q.all(promises).then(function () {
      $scope.loadAddressList();
      defer.resolve();
    }, function (errors) {
      defer.reject(errors);
    });
    return defer.promise;
  }



  $scope.loadTelephoneList = function() {
    waidService.userTelephoneListGet().then(function(data){
      $scope.telephoneNumbers = data.results;
      $scope.originalTelephoneNumbers = angular.copy($scope.telephoneNumbers);
      $scope.checkNewTelephoneNumer();
    })
  };


  $scope.changeAddressValue = function(fieldName, addressField, key) {
    $scope.fieldChange(fieldName);
    $scope.checkNewAddress();
  };

  $scope.addNewAddress = function() {
    $scope.addresses.push({
      'id':'new',
      'address':'',
      'city':'',
      'zipcode':'',
      'country':'',
      'action': '',
      'errors':[]
    });
  }

  $scope.checkAddressChanged = function(originalObject, newObject) {
    if (originalObject.address != newObject.address) {
      return true;
    }
    if (originalObject.zipcode != newObject.zipcode) {
      return true;
    }
    if (originalObject.city != newObject.city) {
      return true;
    }
    if (originalObject.country != newObject.country) {
      return true;
    }
    return false;
  };

  $scope.deleteAddress = function(key) {
    $scope.addresses.splice(key, 1)
  }
  // Checks if any field is filled in..
  $scope.checkAddressAnyFieldFilled = function(address) {
    if (address.address != "") {
      return true;
    }
    if (address.zipcode != "") {
      return true;
    }
    if (address.city != "") {
      return true;
    }
    if (address.country != "") {
      return true;
    }
    return false;
  }

  $scope.checkNewAddress = function(){
    var lastItem = $scope.addresses.slice(-1).pop();
    if (typeof lastItem == 'undefined' || $scope.checkAddressAnyFieldFilled(lastItem)) {
      $scope.addNewAddress();
    }
  }

  $scope.loadAddressList = function() {
    waidService.userAddressListGet().then(function(data){
      $scope.addresses = data.results;
      $scope.originalAddresses = angular.copy($scope.addresses);
      $scope.checkNewAddress();
    })
  };

  $scope.getMultipleCheckBoxName = function(fieldDefinition, key) {
    for(var i=0; fieldDefinition.data.length > i; i++){
      if (fieldDefinition.data[i].id == key) {
        return fieldDefinition.data[i].name;
      }
    }
    return 'Unknown';
  }

  $scope.loadApplicationMetadata = function(){
    waidService.userApplicationMetadataGet().then(function(data){
      var fieldDefinitions = $scope.getAllFieldDefinitions();
      for(var i=0; fieldDefinitions.length > i; i++) {
        var storageType = (typeof fieldDefinitions[i].storageType != 'undefined') ? fieldDefinitions[i].storageType : 'default';
        if (storageType == 'metadata') {
          if (typeof data[fieldDefinitions[i].name] != 'undefined') {
            $scope.model[fieldDefinitions[i].name] = data[fieldDefinitions[i].name];
          }
        }
      }
    });
  }


  $scope.providers = [];
  $scope.getProviders = function () {
    waidService.socialProviderListGet().then(function (data) {
      $scope.providers = data;
    });
  };

  $scope.init = function() {
    $scope.updateProfileInfo();
    $scope.loadApplicationMetadata();
    $scope.loadEmailList();
    $scope.loadTelephoneList();
    $scope.loadAddressList();
    $scope.getProviders();
  }

  $scope.init();
  
}).controller('WAIDIDMCompleteProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.mode = 'complete';
}).controller('WAIDIDMLinkSocialProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.model = {'password':''}
  $scope.errors = [];
  $scope.linkSocialProfile = function(){
    $scope.errors = [];
    waidService.userLinkSocialProfilePost($scope.model).then(function(data){
      $scope.errors = [];
    }, function(data){
      $scope.errors = data;
    })
  }
})
.controller('WAIDIDMLoginCtrl', function ($scope, $location, waidService, waidCore) {
  $scope.waid = waidCore;
  $scope.model = {
    'username': '',
    'password': ''
  };
  $scope.errors = [];
  $scope.login = function () {
    waidService.userLoginPost($scope.model).then(function (data) {
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMLostLoginCtrl', function ($scope, $rootScope, $location, waidService, waidCore) {
  $scope.waid = waidCore;
  $scope.model = { 'email': '' };
  $scope.errors = [];
  $scope.submit = function () {
    waidService.userLostLoginPost($scope.model).then(function (data) {
      $rootScope.$broadcast('waid.idm.action.lostLogin.ok', data);
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMSocialCtrl', function ($scope, $rootScope, $location, waidService, $window, waidCore) {
  $scope.waid = waidCore;
  $scope.providers = [];
  $scope.getProviders = function () {
    waidService.socialProviderListGet().then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].url = data[i].url + '?return_url=' + encodeURIComponent(waidCore.getAlCodeUrl());
      }
      $scope.providers = data;
    });
  };
  $scope.goToSocialLogin = function (provider) {
    $rootScope.$broadcast('waid.idm.action.associateSocial', {'action':'associate_unknown_user', 'provider':provider});
    $window.location.assign(provider.url);
  };
  $scope.getProviders();
}).controller('WAIDIDMAssociatedSocialAccountsCtrl', function ($scope, $rootScope, $location, waidService, $window, waidCore) {
  $scope.waid = waidCore;
  $scope.providers = [];
  $scope.getProviders = function () {
    waidService.socialProviderListGet().then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].url = data[i].url + '?waid=' + encodeURIComponent(data[i].waid_data) + '&return_url=' + encodeURIComponent(waidCore.getAlCodeUrl());
      }
      $scope.providers = data;
    });
  };
  $scope.associateSocialAction = function (provider) {
    
    // Toggle between linking and unlinking
    if (provider.linked) {
      $rootScope.$broadcast('waid.idm.action.associateSocial', {'action':'delete', 'provider':provider});
      waidService.userAssociateSocialDelete(provider.backend).then(function(){
        
        $scope.getProviders();
      })
    } else {
      $rootScope.$broadcast('waid.idm.action.associateSocial', {'action':'associate_known_user', 'provider':provider});
      $window.location.assign(provider.url);
    }
  };
  $scope.getProviders();
}).controller('WAIDIDMRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal, waidCore) {
  $scope.waid = waidCore;
  $scope.show = {};
  $scope.emailIsNotVerified = false;
  $scope.invalidProfileData = false;
  $scope.missingProfileData = false;
  if ($scope.modus == 'complete') {
    // Check for logged-in user
    waidService.userCompleteProfileGet().then(function (data) {
      $scope.model = data.user;
      if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('email_is_not_verified') !== -1) {
        $scope.emailIsNotVerified = true;
      }
      if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('invalid_profile_data') !== -1) {
        $scope.invalidProfileData = true;
        // Set invalid data
        for (var i = 0; i < data.invalid_data.length; i++) {
          $scope.show[data.invalid_data[i]] = true;
        }
      }
      if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('missing_profile_data') !== -1) {
        $scope.missingProfileData = true;
        // Set missing data
        for (var i = 0; i < data.missing_data.length; i++) {
          $scope.show[data.missing_data[i]] = true;
        }
      }
    }, function (data) {
    });
  } else {
    $scope.missingEmailVerification = false;
    $scope.show = {
      'username': true,
      'password': true,
      'email': true,
      'terms_and_conditions_check': true
    };
  }
  // $scope.model = {
  //   'username':'',
  //   'password':'',
  //   'email':'',
  //   'terms_and_conditions_check':false
  // };
  $scope.register = function () {
    if ($scope.model.terms_and_conditions_check) {
      $scope.errors = [];
      if ($scope.modus == 'complete') {
        waidService.userCompleteProfilePost($scope.model).then(function (data) {
          $scope.model = {};
        }, function (data) {
          $scope.errors = data;
        });
      } else {
        waidService.userRegisterPost($scope.model).then(function (data) {
          $scope.model = {};
        }, function (data) {
          $scope.errors = data;
        });
      }
    }
  };
});