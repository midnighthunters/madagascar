//! `MAD_HOME` override tests in an isolated binary so `mad_home()`'s
//! process-wide `OnceLock` initializes from the overridden env var.

use std::path::PathBuf;

#[test]
fn mad_home_override_path_helpers() {
    let tmp = tempfile::tempdir().expect("tempdir");
    let mad_home = tmp.path().to_path_buf();
    unsafe {
        std::env::set_var("MAD_HOME", &mad_home);
    }

    assert_eq!(
        xai_mad_pager::util::pager_toml_path(),
        mad_home.join("pager.toml")
    );
    assert_eq!(
        xai_mad_pager::util::display_mad_home_prefix(),
        "$MAD_HOME"
    );
    assert_eq!(
        xai_mad_pager::util::display_user_mad_path("config.toml"),
        "$MAD_HOME/config.toml"
    );

    let memory_path = mad_home.join("memory/MEMORY.md");
    assert_eq!(
        xai_mad_pager::util::abbreviate_path(&memory_path.display().to_string()),
        "$MAD_HOME/memory/MEMORY.md"
    );

    // Copy-toast paths follow the same abbreviation convention, so a custom
    // $MAD_HOME outside $HOME still displays short.
    assert_eq!(
        xai_mad_pager::clipboard::display_copy_path(&mad_home.join("last-copy.txt")),
        "$MAD_HOME/last-copy.txt"
    );

    assert!(xai_mad_pager::util::is_under_user_mad_home(&memory_path));
    assert!(!xai_mad_pager::util::is_under_user_mad_home(
        PathBuf::from("/tmp/other").as_path()
    ));
}
