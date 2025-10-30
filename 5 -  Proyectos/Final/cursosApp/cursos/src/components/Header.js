import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ROLE_KEY = "userRole";

function NavItem({ label, onPress }) {
  const underline = useRef(new Animated.Value(0)).current;
  const handleHoverIn = () =>
    Animated.timing(underline, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  const handleHoverOut = () =>
    Animated.timing(underline, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  const underlineWidth = underline.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  return (
    <TouchableOpacity
      onPress={onPress}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
      style={styles.navItemContainer}
    >
      <Text style={styles.navItemText}>{label}</Text>
      <Animated.View style={[styles.navUnderline, { width: underlineWidth }]} />
    </TouchableOpacity>
  );
}

export default function Header({ onNavigateSection }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isMobile = width <= 700;

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const { session, profile, signOut } = useContext(AuthContext);
  const [localRole, setLocalRole] = useState(null);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(ROLE_KEY);
      if (stored) setLocalRole(stored);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (profile?.role) {
        setLocalRole(profile.role);
        await AsyncStorage.setItem(ROLE_KEY, profile.role);
      }
    })();
  }, [profile?.role]);

  useEffect(() => {
    if (!session) {
      setLocalRole(null);
      closeAllMenus();
    }
  }, [session]);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setProfileMenu(false);
  };

  const toggleMenu = () => {
    if (profileMenu) setProfileMenu(false);
    const toOpen = !menuOpen;
    setMenuOpen(toOpen);
    Animated.timing(fadeAnim, {
      toValue: toOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleProfileMenu = () => {
    if (menuOpen) setMenuOpen(false);
    const toOpen = !profileMenu;
    setProfileMenu(toOpen);
    Animated.timing(dropdownAnim, {
      toValue: toOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem(ROLE_KEY);
      setLocalRole(null);
      closeAllMenus();
    } catch (e) {
      console.error(" Error al cerrar sesión:", e);
    }
  };

  const handleScroll = (section) => {
    try {
      const current = navigation?.getState?.()?.routes?.slice(-1)[0]?.name;
      if (current !== "Home") {
        navigation.navigate("Home");
        setTimeout(() => onNavigateSection?.(section), 400);
      } else {
        onNavigateSection?.(section);
      }
    } catch {
      navigation.navigate("Home");
      setTimeout(() => onNavigateSection?.(section), 400);
    }
    closeAllMenus();
  };

  const transitionAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(transitionAnim, {
      toValue: session ? 1 : 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [session]);

  return (
    <Animated.View style={[styles.headerWrapper, { opacity: transitionAnim }]}>
      <View style={[styles.headerContainer, isMobile && { paddingVertical: 25 }]}>
        <Text style={styles.logoText} onPress={() => handleScroll("inicio")}>
          onlearn
        </Text>

        {!isMobile && (
          <View style={styles.navLinks}>
            <NavItem label="Inicio" onPress={() => handleScroll("inicio")} />
            <NavItem label="Cursos" onPress={() => handleScroll("cursos")} />
            <NavItem label="Categorías" onPress={() => handleScroll("categorias")} />
            <NavItem label="Contacto" onPress={() => handleScroll("contacto")} />
          </View>
        )}

        {!isMobile && (
          <>
            {session ? (
              <View style={styles.profileWrapper}>
                <TouchableOpacity style={styles.avatarButton} onPress={toggleProfileMenu}>
                  <Image
                    source={
                      profile?.avatar_url
                        ? { uri: profile.avatar_url }
                        : require("../../assets/Perfil.png")
                    }
                    style={styles.avatar}
                  />
                </TouchableOpacity>

                {profileMenu && (
                  <Animated.View
                    style={[
                      styles.dropdownMenu,
                      {
                        opacity: dropdownAnim,
                        transform: [
                          {
                            translateY: dropdownAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >

                    {localRole === "client" && (
                      <>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("MyCourses");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Mis cursos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                          <Text style={styles.dropdownText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                      </>
                    )}


                    {localRole === "pending_instructor" && (
                      <>
                        <View style={styles.dropdownItem}>
                          <Text style={styles.dropdownTextPending}>
                            ⏳ Esperando aprobación
                          </Text>
                          <Text style={styles.dropdownSubtext}>
                            Tu solicitud está siendo revisada
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("MyCourses");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Mis cursos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                          <Text style={styles.dropdownText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {localRole === "instructor" && (
                      <>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("CreateCourse");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Crear curso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("MyCourses");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Mis cursos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                          <Text style={styles.dropdownText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {localRole === "admin" && (
                      <>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("AdminPanel");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Panel Admin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("CreateCourse");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Crear curso</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate("MyCourses");
                            closeAllMenus();
                          }}
                        >
                          <Text style={styles.dropdownText}>Mis cursos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                          <Text style={styles.dropdownText}>Cerrar sesión</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </Animated.View>
                )}
              </View>
            ) : (
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => {
                    navigation.navigate("Login");
                    closeAllMenus();
                  }}
                >
                  <Text style={styles.loginText}>LOG IN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signupBtn}
                  onPress={() => {
                    navigation.navigate("Register");
                    closeAllMenus();
                  }}
                >
                  <Text style={styles.signupText}>SIGN UP</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {isMobile && (
          <View style={styles.mobileRight}>
            {session && (
              <TouchableOpacity onPress={toggleProfileMenu} style={{ marginRight: 10 }}>
                <Image
                  source={
                    profile?.avatar_url
                      ? { uri: profile.avatar_url }
                      : require("../../assets/Perfil.png")
                  }
                  style={styles.avatarSmall}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name={menuOpen ? "close" : "menu"} size={34} color="#0B7077" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isMobile && menuOpen && (
        <Animated.View style={[styles.mobileMenu, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => handleScroll("inicio")} style={styles.mobileItem}>
            <Text style={styles.mobileText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleScroll("cursos")} style={styles.mobileItem}>
            <Text style={styles.mobileText}>Cursos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleScroll("categorias")} style={styles.mobileItem}>
            <Text style={styles.mobileText}>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleScroll("contacto")} style={styles.mobileItem}>
            <Text style={styles.mobileText}>Contacto</Text>
          </TouchableOpacity>

          {!session && (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login");
                  closeAllMenus();
                }}
                style={styles.mobileItem}
              >
                <Text style={styles.mobileText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                  closeAllMenus();
                }}
                style={styles.mobileItem}
              >
                <Text style={styles.mobileText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}

      {isMobile && profileMenu && (
        <Animated.View style={[styles.mobileProfileMenu, { opacity: dropdownAnim }]}>
          {/* 👨‍🎓 Cliente Mobile */}
          {localRole === "client" && (
            <>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("MyCourses");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Mis cursos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileItem} onPress={handleLogout}>
                <Text style={styles.mobileText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ⏳ Pending Instructor Mobile */}
          {localRole === "pending_instructor" && (
            <>
              <View style={styles.mobileItem}>
                <Text style={styles.mobileTextPending}>⏳ Esperando aprobación</Text>
                <Text style={styles.mobileSubtext}>Tu solicitud está siendo revisada</Text>
              </View>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("MyCourses");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Mis cursos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileItem} onPress={handleLogout}>
                <Text style={styles.mobileText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 👨‍🏫 Instructor Mobile */}
          {localRole === "instructor" && (
            <>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("CreateCourse");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Crear curso</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("MyCourses");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Mis cursos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileItem} onPress={handleLogout}>
                <Text style={styles.mobileText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 👑 Admin Mobile */}
          {localRole === "admin" && (
            <>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("AdminPanel");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Panel Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("CreateCourse");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Crear curso</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mobileItem}
                onPress={() => {
                  navigation.navigate("MyCourses");
                  closeAllMenus();
                }}
              >
                <Text style={styles.mobileText}>Mis cursos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mobileItem} onPress={handleLogout}>
                <Text style={styles.mobileText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: { zIndex: 100 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "#F8FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logoText: { color: "#0B7077", fontWeight: "800", fontSize: 24 },
  navLinks: { flexDirection: "row", gap: 25 },
  navItemContainer: { position: "relative", alignItems: "center" },
  navItemText: { color: "#0B7077", fontSize: 16, fontWeight: "600" },
  navUnderline: {
    height: 2,
    backgroundColor: "#FF7A00",
    position: "absolute",
    bottom: -4,
    borderRadius: 4,
  },
  buttons: { flexDirection: "row", gap: 12, alignItems: "center" },
  loginBtn: {
    borderColor: "#0B7077",
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  loginText: { color: "#0B7077", fontWeight: "700" },
  signupBtn: {
    backgroundColor: "#0B7077",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  signupText: { color: "#fff", fontWeight: "700" },
  profileWrapper: { position: "relative" },
  avatarButton: { width: 34, height: 34, borderRadius: 17 },
  avatar: { width: "100%", height: "100%", borderRadius: 17 },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    paddingVertical: 8,
    minWidth: 200,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 15 },
  dropdownText: { fontSize: 15, color: "#0B7077", fontWeight: "500" },
  dropdownTextPending: { 
    fontSize: 15, 
    color: "#FF7A00", 
    fontWeight: "600" 
  },
  dropdownSubtext: { 
    fontSize: 12, 
    color: "#666", 
    marginTop: 2 
  },
  mobileRight: { flexDirection: "row", alignItems: "center" },
  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#0B7077",
  },
  mobileMenu: {
    position: "absolute",
    top: 90,
    right: 15,
    left: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  mobileProfileMenu: {
    position: "absolute",
    top: 90,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  mobileItem: { paddingVertical: 10 },
  mobileText: { fontSize: 16, color: "#0B7077", fontWeight: "600" },
  mobileTextPending: { 
    fontSize: 16, 
    color: "#FF7A00", 
    fontWeight: "600" 
  },
  mobileSubtext: { 
    fontSize: 12, 
    color: "#666", 
    marginTop: 2 
  },
});